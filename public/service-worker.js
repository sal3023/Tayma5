
const CACHE_NAME = 'eliteblog-pro-cache-v2'; // Increment cache version for new strategy
const urlsToCache = [
  '/',
  '/index.html',
  // Vite manages the main JS/CSS bundles, which are usually hashed.
  // These will be dynamically cached using the network-first or stale-while-revalidate strategy.
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap',
  'https://fonts.gstatic.com/s/tajawal/v9/IILQGSyK-f3TIEM4j8D_xY-i.woff2', // Example font file
  '/manifest.json',
  '/icons/icon-192x192.png', // Example icon
  // Add other critical static assets here
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Failed to cache during install:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Check if it's a navigation request (for HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch(() => {
          // Fallback for offline if navigation fails and no cache
          return caches.match('/index.html'); // Serve main app HTML
        })
    );
    return; // Don't process with other strategies for navigation
  }

  // Stale-While-Revalidate strategy for other assets (images, scripts, styles)
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const networkPromise = fetch(event.request).then((networkResponse) => {
        // Cache the new network response
        if (networkResponse.ok && event.request.method === 'GET') {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((error) => {
        console.warn(`[Service Worker] Network fetch failed for ${event.request.url}:`, error);
        // If network fails, but we have a cached response, use that.
        // If no cached response, the error will propagate.
        return cachedResponse || Promise.reject(error);
      });

      // If there's a cached response, return it immediately.
      // Otherwise, wait for the network response.
      return cachedResponse || networkPromise;
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
