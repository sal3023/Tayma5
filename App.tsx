
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, Post, TrendIdea } from './types';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PostDetail from './components/PostDetail';
import BlogEditor from './components/BlogEditor';
import Dashboard from './components/Dashboard';
import SitemapView from './components/SitemapView';
import BusinessPlanGenerator from './components/BusinessPlanGenerator';
import TrendExplorer from './components/TrendExplorer';
import SmartAssistant from './components/SmartAssistant';
import LegalPages from './components/LegalPages';
import Wallet from './components/Wallet';
import ExternalBlogAnalyser from './components/ExternalBlogAnalyser';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'مستقبل الذكاء الاصطناعي في 2025',
    excerpt: 'استكشاف شامل للتحولات الجذرية التي سيشهدها العالم مع تطور نماذج اللغة الكبيرة والتطبيقات العملية.',
    content: 'يعتبر عام 2025 نقطة تحول حقيقية في تاريخ التقنية...',
    author: 'أحمد محمود',
    date: '24 أكتوبر 2024',
    category: 'تقنية',
    image: 'https://picsum.photos/seed/tech/800/400',
    readTime: '5 دقائق',
    views: 1250,
    seoTitle: 'دليل الذكاء الاصطناعي 2025: ما الذي ينتظرنا؟',
    seoDescription: 'تعرف على أهم التوقعات والتحولات في عالم الذكاء الاصطناعي لعام 2025.',
    targetMarket: 'Global'
  }
];

const GA4_STORAGE_KEY = 'ga4_measurement_id';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editingIdea, setEditingIdea] = useState<Partial<Post> | null>(null);
  const [ga4MeasurementId, setGa4MeasurementIdState] = useState<string | null>(() => {
    return localStorage.getItem(GA4_STORAGE_KEY);
  });

  const handlePostClick = (id: string) => {
    setSelectedPostId(id);
    setView(ViewMode.POST);
  };

  const handleSavePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setEditingIdea(null);
    setView(ViewMode.HOME);
  };

  const handleStartArticleFromTrend = (idea: TrendIdea) => {
    setEditingIdea({
      title: idea.topic,
      category: 'تقنية',
      content: '',
    });
    setView(ViewMode.EDITOR);
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);

  // Function to set GA4 Measurement ID and update localStorage
  const setGa4MeasurementId = useCallback((id: string | null) => {
    if (id) {
      localStorage.setItem(GA4_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(GA4_STORAGE_KEY);
    }
    setGa4MeasurementIdState(id);
  }, []);

  // Effect to dynamically inject GA4 script
  useEffect(() => {
    const injectGa4Script = (id: string) => {
      if (!id) return;

      // Remove existing GA scripts to prevent duplicates
      document.querySelectorAll('script[data-ga-script]').forEach(script => script.remove());

      // Initialize dataLayer and gtag if not already present
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
      (window as any).gtag = gtag;

      gtag('js', new Date());
      gtag('config', id);

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      script.dataset.gaScript = 'true'; // Custom attribute to easily find and remove
      document.head.appendChild(script);

      console.log(`GA4 script injected with ID: ${id}`);
    };

    if (ga4MeasurementId) {
      injectGa4Script(ga4MeasurementId);
    } else {
      // If ID is removed, clean up scripts
      document.querySelectorAll('script[data-ga-script]').forEach(script => script.remove());
      // Optionally clear dataLayer and gtag if they were only for this GA instance
      (window as any).dataLayer = undefined;
      (window as any).gtag = undefined;
    }
  }, [ga4MeasurementId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar currentView={view} setView={setView} />
      <h1 className="text-center text-3xl font-bold text-blue-600 py-8">EliteBlog Pro - التطبيق يعمل!</h1>
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {view === ViewMode.HOME && <Home posts={posts} onPostClick={handlePostClick} />}
        {view === ViewMode.POST && selectedPost && <PostDetail post={selectedPost} onBack={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.EDITOR && (
          <BlogEditor 
            onSave={handleSavePost} 
            onCancel={() => { setView(ViewMode.HOME); setEditingIdea(null); }} 
            initialData={editingIdea || {}}
          />
        )}
        {view === ViewMode.DASHBOARD && 
          <Dashboard 
            posts={posts} 
            onUpdatePost={(updatedPost) => setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))} 
            ga4MeasurementId={ga4MeasurementId}
            setGa4MeasurementId={setGa4MeasurementId}
          />}
        {view === ViewMode.WALLET && <Wallet />}
        {view === ViewMode.SITEMAP && <SitemapView posts={posts} onBack={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.BUSINESS_PLAN && <BusinessPlanGenerator />}
        {view === ViewMode.TRENDS && <TrendExplorer onStartArticle={handleStartArticleFromTrend} />}
        {view === ViewMode.PRIVACY && <LegalPages type="privacy" onBack={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.TERMS && <LegalPages type="terms" onBack={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.EXTERNAL_BLOG_ANALYSER && <ExternalBlogAnalyser posts={posts} ga4MeasurementId={ga4MeasurementId} onBack={() => setView(ViewMode.HOME)} />}
      </main>

      <SmartAssistant posts={posts} />

      <footer className="border-t bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500">
          <div className="mb-4 md:mb-0 text-center md:text-right">
            <h2 className="text-xl font-bold text-blue-600 mb-1">EliteBlog Pro</h2>
            <p className="text-xs font-bold">نظام تدوين عالمي فائق الأداء.</p>
          </div>
          <div className="flex space-x-reverse space-x-4 text-[10px] font-black">
             <button onClick={() => setView(ViewMode.SITEMAP)} className="hover:text-blue-600">خارطة الموقع</button>
             <button onClick={() => setView(ViewMode.PRIVACY)} className="hover:text-blue-600">الخصوصية</button>
             <button onClick={() => setView(ViewMode.TERMS)} className="hover:text-blue-600">الشروط</button>
          </div>
          <div className="mt-4 md:mt-0 text-[10px] font-bold">
            © {new Date().getFullYear()} EliteBlog
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;