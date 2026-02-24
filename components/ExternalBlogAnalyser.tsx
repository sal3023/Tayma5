
import React, { useState } from 'react';
import { analyzeBlog, getBlogSpeedOptimizationSuggestions } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '../types';

interface ExternalBlogAnalyserProps {
  onBack: () => void;
  posts: Post[];
  ga4MeasurementId: string | null;
}

const ExternalBlogAnalyser: React.FC<ExternalBlogAnalyserProps> = ({ onBack, posts, ga4MeasurementId }) => {
  const [analysisMode, setAnalysisMode] = useState<'external' | 'internal' | 'speed'>('external');
  const [blogSitemapUrl, setBlogSitemapUrl] = useState('https://www.tosh5.shop/sitemap.xml');
  const [bloggerUrl, setBloggerUrl] = useState(''); // حالة جديدة لرابط مدونة Blogger لتحليل السرعة
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enableLocalSEO, setEnableLocalSEO] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationError(`فشل تحديد الموقع: ${err.message}. يرجى السماح بالوصول لموقعك.`);
          setLocationLoading(false);
          setUserLocation(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("المتصفح لا يدعم تحديد الموقع الجغرافي.");
      setLocationLoading(false);
      setUserLocation(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      if (analysisMode === 'speed') {
        if (!bloggerUrl) {
          setError("الرجاء إدخال رابط مدونة Blogger لتحليل السرعة.");
          setLoading(false);
          return;
        }
        const result = await getBlogSpeedOptimizationSuggestions(bloggerUrl);
        setAnalysisResult(result);
      } else {
        let analysisOptions: { blogSitemapUrl?: string; internalPostsData?: { id: string; title: string; excerpt: string; content: string; category: string; }[]; latLng?: { latitude: number; longitude: number; }; };

        if (analysisMode === 'external') {
          if (!blogSitemapUrl) {
            setError("الرجاء إدخال رابط خريطة الموقع (Sitemap URL) للمدونة الخارجية.");
            setLoading(false);
            return;
          }
          analysisOptions = { blogSitemapUrl };
        } else { // analysisMode === 'internal'
          if (!posts || posts.length === 0) {
            setError("لا توجد مقالات في مدونتك الحالية لتحليلها. يرجى إضافة مقالات أولاً.");
            setLoading(false);
            return;
          }
          const internalPostsData = posts.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content.substring(0, 500),
            category: post.category,
          }));
          analysisOptions = { internalPostsData };
        }

        if (enableLocalSEO && !userLocation) {
            setError("لتفعيل تحليل SEO المحلي، يجب تحديد موقعك أولاً. يرجى النقر على 'الحصول على موقعي الحالي'.");
            setLoading(false);
            return;
        }

        if (enableLocalSEO && userLocation) {
          analysisOptions.latLng = userLocation;
        }
        const result = await analyzeBlog(analysisOptions);
        setAnalysisResult(result);
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "فشل تحليل المدونة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 fade-in">
      <button 
        onClick={onBack}
        className="mb-8 text-blue-600 font-bold flex items-center gap-2 hover:-translate-x-2 transition-transform"
      >
        <span>→</span> العودة
      </button>

      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-100">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-purple-50 rounded-full text-purple-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-purple-100">
            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
            أداة تحليل المدونات بـ "أتلانتس"
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            حلل مدونتك بذكاء "أتلانتس" الخارق
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-bold leading-relaxed">
            احصل على رؤى فورية لتحسين SEO (العام والمحلي)، اكتشاف فجوات المحتوى، وزيادة الأرباح لمدونتك.
          </p>
        </header>

        <form onSubmit={handleAnalyze} className="space-y-8 mb-16">
          {/* Analysis Mode Selection */}
          <div className="space-y-4 bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center shadow-inner">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">اختر وضع التحليل</p>
            <div className="flex justify-center gap-4">
              <label className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white rounded-xl shadow-md border border-white hover:border-blue-200 transition-all">
                <input
                  type="radio"
                  name="analysisMode"
                  value="external"
                  checked={analysisMode === 'external'}
                  onChange={() => { setAnalysisMode('external'); setAnalysisResult(null); setError(null); }}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="text-sm font-black text-blue-900">مدونة خارجية (SEO/محتوى)</span>
              </label>
              <label className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white rounded-xl shadow-md border border-white hover:border-blue-200 transition-all">
                <input
                  type="radio"
                  name="analysisMode"
                  value="internal"
                  checked={analysisMode === 'internal'}
                  onChange={() => { setAnalysisMode('internal'); setAnalysisResult(null); setError(null); }}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="text-sm font-black text-blue-900">مدونتي (EliteBlog Pro)</span>
              </label>
              <label className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white rounded-xl shadow-md border border-white hover:border-blue-200 transition-all">
                <input
                  type="radio"
                  name="analysisMode"
                  value="speed"
                  checked={analysisMode === 'speed'}
                  onChange={() => { setAnalysisMode('speed'); setAnalysisResult(null); setError(null); }}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="text-sm font-black text-blue-900">تحليل السرعة (Blogger)</span>
              </label>
            </div>
          </div>

          {/* Sitemap URL Input (Conditional for External Content Analysis) */}
          {analysisMode === 'external' && (
            <div>
              <label htmlFor="blogUrl" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
                رابط خريطة الموقع (Sitemap URL) للمدونة الخارجية
              </label>
              <input
                type="url"
                id="blogUrl"
                value={blogSitemapUrl}
                onChange={(e) => setBlogSitemapUrl(e.target.value)}
                placeholder="مثال: https://www.tosh5.shop/sitemap.xml"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-5 focus:border-blue-600 outline-none transition-all text-lg font-medium text-center shadow-inner placeholder-slate-300"
                required={analysisMode === 'external'}
              />
            </div>
          )}

           {/* Internal Blog Info (Conditional for Internal Content Analysis) */}
           {analysisMode === 'internal' && (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center text-slate-600 font-bold text-sm shadow-inner">
                <p>سيقوم "أتلانتس" بتحليل جميع المقالات المنشورة داخل تطبيق EliteBlog Pro.</p>
                {posts.length === 0 && <p className="text-red-500 mt-2">⚠️ لا توجد مقالات في مدونتك الحالية لتحليلها. يرجى إضافة مقالات أولاً.</p>}
                {posts.length > 0 && <p className="text-emerald-600 mt-2">✅ سيتم تحليل {posts.length} مقال.</p>}
                
                {/* Display GA4 Measurement ID */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">معرف قياس Google Analytics 4</p>
                  {ga4MeasurementId ? (
                    <p className="text-emerald-600 text-base font-black">
                      ✅ متصل: <span className="underline">{ga4MeasurementId}</span>
                    </p>
                  ) : (
                    <p className="text-orange-600 text-base font-black">
                      ⚠️ غير متصل. يرجى ربط GA4 في <span className="text-blue-600 hover:underline cursor-pointer">لوحة التحكم</span>.
                    </p>
                  )}
                </div>
            </div>
           )}

           {/* Blogger URL Input (Conditional for Speed Analysis) */}
           {analysisMode === 'speed' && (
             <div>
               <label htmlFor="bloggerSpeedUrl" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
                 رابط مدونة Blogger (لتحليل السرعة)
               </label>
               <input
                 type="url"
                 id="bloggerSpeedUrl"
                 value={bloggerUrl}
                 onChange={(e) => setBloggerUrl(e.target.value)}
                 placeholder="مثال: https://your-blog.blogspot.com/"
                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-5 focus:border-purple-600 outline-none transition-all text-lg font-medium text-center shadow-inner placeholder-slate-300"
                 required={analysisMode === 'speed'}
               />
             </div>
           )}

          {/* Local SEO Analysis Section */}
          {analysisMode !== 'speed' && ( // لا نعرض تحليل SEO المحلي لتحليل السرعة
            <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
              <label className="flex items-center cursor-pointer gap-4">
                <input
                  type="checkbox"
                  checked={enableLocalSEO}
                  onChange={(e) => {
                      setEnableLocalSEO(e.target.checked);
                      if (!e.target.checked) {
                          setUserLocation(null);
                          setLocationError(null);
                      }
                  }}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-black text-slate-700">تفعيل تحليل SEO المحلي (يتطلب موقعك)</span>
              </label>
              {enableLocalSEO && (
                <div className="mt-4 space-y-4">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="w-full bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-md hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {locationLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "🌍 الحصول على موقعي الحالي"
                    )}
                  </button>
                  {userLocation && (
                    <p className="text-emerald-600 text-xs font-bold text-center">
                      ✅ تم الحصول على الموقع: خط الطول {userLocation.latitude.toFixed(4)}, خط العرض {userLocation.longitude.toFixed(4)}
                    </p>
                  )}
                  {locationError && (
                    <p className="text-red-600 text-xs font-bold text-center">
                      ⚠️ {locationError}
                    </p>
                  )}
                  <p className="text-slate-500 text-xs text-center">
                    ملاحظة: للسماح بالتحليل المحلي، تأكد من أن متصفحك يسمح بالوصول إلى موقعك الجغرافي.
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              (analysisMode === 'internal' && posts.length === 0) ||
              (analysisMode === 'speed' && !bloggerUrl) ||
              (analysisMode === 'external' && !blogSitemapUrl)
            }
            className="w-full bg-blue-600 text-white px-12 py-6 rounded-3xl font-black shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "🪄 تحليل المدونة الآن"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 p-6 rounded-3xl text-sm font-bold text-red-700 leading-relaxed border border-red-100 shadow-md mb-16">
            <p><strong>خطأ:</strong> {error}</p>
            <p className="mt-2 text-xs opacity-80">
              تذكر أن التحليل يعتمد على قدرة Gemini على الوصول إلى بيانات مدونتك عبر الإنترنت أو توفرها محلياً. تأكد أن الرابط صحيح أو أن هناك مقالات متاحة للتحليل.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
            <div className="w-24 h-24 border-8 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
            <p className="text-blue-600 font-black animate-pulse uppercase tracking-[0.5em] text-xs">
              محرك أتلانتس يحلل مدونتك بعمق... قد يستغرق الأمر بضع لحظات.
            </p>
          </div>
        )}

        {analysisResult && (
          <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <span className="text-5xl">💡</span> تقرير تحليل أتلانتس لمدونتك
            </h2>
            <div className="prose prose-slate max-w-none leading-[1.8] font-medium text-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisResult}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalBlogAnalyser;