
import React, { useState } from 'react';
import { analyzeBlogGaps, getSeoAuditSuggestions, getMonetizationSuggestions, getEngagementSuggestions, getBlogSpeedOptimizationSuggestions, generateBloggerTemplatePlan } from '../services/gemini';
import { Post } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SmartAssistantProps {
  posts: Post[];
  ga4MeasurementId: string | null; // إضافة معرف GA4
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ posts, ga4MeasurementId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blogAnalysis' | 'deploymentHelp'>('blogAnalysis');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<'seo' | 'content_gaps' | 'monetization' | 'engagement' | 'blogger_speed' | 'blogger_template_plan'>('seo');
  const [bloggerUrl, setBloggerUrl] = useState('https://www.tosh5.shop'); // استخدام نفس الحالة لرابط Blogger

  const handleAnalysis = async () => {
    setLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      let result: string | null = null;
      switch (selectedAnalysisType) {
        case 'seo':
          result = await getSeoAuditSuggestions(posts, ga4MeasurementId);
          break;
        case 'content_gaps':
          result = await analyzeBlogGaps(posts);
          break;
        case 'monetization':
          result = await getMonetizationSuggestions(posts, ga4MeasurementId);
          break;
        case 'engagement':
          result = await getEngagementSuggestions(posts);
          break;
        case 'blogger_speed':
          if (!bloggerUrl) {
            setError("الرجاء إدخال رابط مدونة Blogger لتحليل السرعة.");
            setLoading(false);
            return;
          }
          result = await getBlogSpeedOptimizationSuggestions(bloggerUrl);
          break;
        case 'blogger_template_plan':
          if (!bloggerUrl) {
            setError("الرجاء إدخال رابط مدونة Blogger لتوليد خطة القالب.");
            setLoading(false);
            return;
          }
          result = await generateBloggerTemplatePlan(bloggerUrl, ga4MeasurementId);
          
          // فحص إضافي لنتيجة فارغة من Gemini حتى لو لم يحدث خطأ في الـ API
          if (!result || result.trim() === '') {
            setError("عذراً، لم يتمكن أتلانتس من توليد خطة القالب. قد يكون السبب مشكلة مؤقتة أو أن النموذج لم يجد معلومات كافية لإنشاء الخطة.");
            setLoading(false);
            return;
          }
          break;
        default:
          result = "يرجى اختيار نوع التحليل.";
      }
      setAnalysisResult(result);
    } catch (err: any) {
      // تحسين تسجيل الخطأ وتقديم رسائل أكثر تحديداً للمستخدم
      console.error("SmartAssistant Analysis Error (Detailed):", err);
      let userMessage = "فشل التحليل. يرجى المحاولة مرة أخرى.";
      if (err.message && err.message.includes("API Key is missing")) {
        userMessage = "⚠️ مفتاح API مفقود أو غير صالح. يرجى التأكد من ضبط 'GEMINI_API_KEY' في متغيرات بيئة Vercel بشكل صحيح.";
      } else if (err.message && err.message.includes("quota exceeded")) {
        userMessage = "⚠️ تجاوزت حد الاستخدام المسموح به لمفتاح API الخاص بك. يرجى التحقق من لوحة تحكم Gemini API.";
      } else if (err.message && err.message.includes("Failed to fetch")) {
        userMessage = "⚠️ فشل في الاتصال بخدمة Gemini. قد يكون هناك مشكلة في اتصالك بالإنترنت أو في خدمة Gemini نفسها.";
      } else if (err.message) {
        userMessage = `خطأ في محرك أتلانتس: ${err.message}`;
      }
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploymentHelp = (type: 'vercel' | 'ga4_help' | 'blog_speed_optimization_info') => {
    setLoading(true);
    setAnalysisResult(null);
    setError(null);

    setTimeout(() => {
      let content = "";
      if (type === 'vercel') {
        content = `
🚀 **دليل النشر على Vercel:**
1. اذهب إلى Vercel.com واربط مستودع GitHub الخاص بك.
2. في إعدادات المشروع (Settings > Environment Variables):
3. أضف مفتاح جديد باسم **GEMINI_API_KEY**.
4. ضع قيمة مفتاح Gemini الخاص بك هناك.
5. اضغط **Deploy**.. وسيتم تحديث تطبيقك آلياً مع كل "Push" للـ GitHub!
        `;
      } else if (type === 'ga4_help') {
        content = `
💡 **كيف تجد معرف قياس Google Analytics 4 (GA4) الخاص بك وتربطه بـ Blogger؟**

1.  **سجل الدخول إلى Google Analytics:** اذهب إلى analytics.google.com.
2.  **اختر حسابك:** تأكد من أنك في حساب Analytics الصحيح.
3.  **انتقل إلى "المشرف" (Admin):** ابحث عن أيقونة الترس في الزاوية السفلية اليسرى.
4.  **اختر "الخصائص" (Property):** ضمن عمود "الخصائص"، تأكد من تحديد خاصية GA4 (عادة ما يكون لها "GA4" في اسمها أو رقم يبدأ بـ G-).
5.  **اذهب إلى "إعدادات تدفقات البيانات" (Data Streams):** ضمن عمود "الخاصية"، انقر على "تدفقات البيانات".
6.  **اختر تدفق الويب الخاص بك:** انقر على تدفق بيانات الويب الخاص بمدونتك (مثال: "Web").
7.  **ابحث عن "معرف القياس" (Measurement ID):** ستجده في صفحة تفاصيل تدفق الويب، ويبدأ بـ 'G-' (مثال: 'G-XXXXXXXXXX'). انسخ هذا المعرف.

**لربط GA4 بمدونة Blogger:**
*   **الطريقة الأسهل:** في لوحة تحكم Blogger، اذهب إلى "الإعدادات" (Settings) > "Google Analytics 4" (قد يختلف الاسم قليلاً). الصق معرف القياس 'G-XXXXXXXXXX' هناك.
*   **الطريقة اليدوية (إذا لم يتوفر الخيار أعلاه أو لقوالب قديمة):**
    1.  في Google Analytics، اذهب إلى "تدفقات البيانات" (Data Streams) > اختر تدفق الويب الخاص بك.
    2.  انقر على "إرشادات وضع العلامات" (Tagging instructions).
    3.  اختر "تثبيت يدوي" (Install manually) وانسخ الكود كاملاً (يبدأ بـ \`<script async src="https://www.googletagmanager.com/gtag/js?..."></script>\`).
    4.  في لوحة تحكم Blogger، اذهب إلى "المظهر" (Theme) > "تعديل HTML" (Edit HTML).
    5.  الصق الكود كاملاً بعد وسم \`<head>\` مباشرةً. احفظ التغييرات.

انسخ هذا المعرف والصقه في إعدادات GA4 في لوحة تحكم "أتلانتس" (إذا كنت تدير EliteBlog Pro) أو في Blogger مباشرةً.
        `;
      } else if (type === 'blog_speed_optimization_info') {
        content = `
🚀 **نصائح عامة لتحسين سرعة المدونة (EliteBlog Pro / Blogger):**

سرعة المدونة عامل حاسم لتحسين تجربة المستخدم و SEO. إليك بعض النصائح:

**لـ EliteBlog Pro:**
1.  **صور مُحسّنة:** تأكد من أن الصور التي تستخدمها مُحسّنة للحجم والنوع (مثل WebP).
2.  **المحتوى:** احتفظ بالمحتوى نظيفًا ومرتبًا، وتجنب الإضافات غير الضرورية التي قد تبطئ التحميل.
3.  **الاستضافة:** تعتمد سرعة EliteBlog Pro بشكل كبير على استضافة Vercel السريعة التي تستخدم شبكة Edge العالمية. تأكد من أن تطبيقك مُنشر بشكل صحيح.

**لـ Blogger (بلوجر):**
1.  **قالب خفيف:** اختر قوالب Blogger سريعة الاستجابة والخفيفة. تجنب القوالب التي تحتوي على الكثير من الميزات أو السكريبتات الثقيلة.
2.  **تحسين الصور:** ضغط الصور قبل رفعها إلى Blogger. استخدم تنسيقات حديثة مثل WebP.
3.  **تقليل السكريبتات:** راجع الأدوات (Widgets) والسكريبتات الخارجية في مدونتك. إزالة غير الضروري منها.
4.  **استخدام التخزين المؤقت (Caching):** تأكد من تفعيل التخزين المؤقت للمتصفح إذا كان قالبك يدعم ذلك.
5.  **Google PageSpeed Insights:** استخدم أداة [Google PageSpeed Insights](https://pagespeed.web.dev/) لتحليل أداء مدونتك والحصول على توصيات مخصصة.
6.  **شبكة توصيل المحتوى (CDN):** Blogger يستخدم CDN الخاص بجوجل تلقائياً للصور والملفات الثابتة، مما يساعد في السرعة.

**قياس السرعة:**
*   يمكنك استخدام [Google PageSpeed Insights](https://pagespeed.web.dev/) للحصول على تقارير تفصيلية عن سرعة مدونتك على كل من أجهزة الكمبيوتر والهواتف المحمولة.
*   تذكر أن معرف قياس GA4 (G-XXXXXXXXXX) يستخدم لتتبع سلوك المستخدم والزيارات، وليس لقياس سرعة الصفحة بشكل مباشر. ومع ذلك، يمكن لـ GA4 تتبع بعض مقاييس تجربة المستخدم المتعلقة بالسرعة إذا تم تكوينه بشكل صحيح.
        `;
      }
      setAnalysisResult(content);
      setLoading(false);
    }, 800);
  };

  const isBloggerSpecificAnalysis = selectedAnalysisType === 'blogger_speed' || selectedAnalysisType === 'blogger_template_plan';

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[999]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 active:scale-95 border-4 border-white"
          aria-label={isOpen ? "إغلاق المساعد الذكي" : "فتح المساعد الذكي"}
        >
          <span className="text-2xl">{isOpen ? '✕' : '🤖'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-[90vw] max-w-[450px] h-[600px] bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.25)] border border-slate-200 flex flex-col z-[999] overflow-hidden animate-in slide-in-from-bottom-5">
          <header className="bg-slate-900 p-8 text-white flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                أتلانتس: مركز القيادة الذكي
              </h3>
            </div>
            <div className="flex gap-3 p-1.5 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
              <button 
                onClick={() => { setActiveTab('blogAnalysis'); setAnalysisResult(null); setError(null); setLoading(false); }}
                className={`flex-1 text-[10px] font-black py-3 rounded-xl transition-all ${activeTab === 'blogAnalysis' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                aria-label="عرض تحليل المدونة"
              >
                تحليل المدونة
              </button>
              <button 
                onClick={() => { setActiveTab('deploymentHelp'); setAnalysisResult(null); setError(null); setLoading(false); }}
                className={`flex-1 text-[10px] font-black py-3 rounded-xl transition-all ${activeTab === 'deploymentHelp' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                aria-label="عرض المساعدة والنشر"
              >
                المساعدة والنشر
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            {activeTab === 'blogAnalysis' ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">اختر نوع التحليل لمدونتك</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center cursor-pointer gap-2 p-3 bg-slate-50 rounded-xl shadow-inner border border-slate-100 hover:border-blue-200 transition-all">
                      <input type="radio" name="analysisType" value="seo" checked={selectedAnalysisType === 'seo'} onChange={() => { setSelectedAnalysisType('seo'); setAnalysisResult(null); setError(null); }} className="form-radio text-blue-600 h-4 w-4" aria-label="اختيار فحص SEO شامل" />
                      <span className="text-xs font-black text-slate-700">فحص SEO شامل</span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-2 p-3 bg-slate-500/5 rounded-xl shadow-inner border border-slate-100 hover:border-blue-200 transition-all">
                      <input type="radio" name="analysisType" value="content_gaps" checked={selectedAnalysisType === 'content_gaps'} onChange={() => { setSelectedAnalysisType('content_gaps'); setAnalysisResult(null); setError(null); }} className="form-radio text-blue-600 h-4 w-4" aria-label="اختيار تحليل فجوات المحتوى" />
                      <span className="text-xs font-black text-slate-700">فجوات المحتوى</span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-2 p-3 bg-slate-500/5 rounded-xl shadow-inner border border-slate-100 hover:border-blue-200 transition-all">
                      <input type="radio" name="analysisType" value="monetization" checked={selectedAnalysisType === 'monetization'} onChange={() => { setSelectedAnalysisType('monetization'); setAnalysisResult(null); setError(null); }} className="form-radio text-blue-600 h-4 w-4" aria-label="اختيار تحليل تحسين الأرباح" />
                      <span className="text-xs font-black text-slate-700">تحسين الأرباح</span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-2 p-3 bg-slate-500/5 rounded-xl shadow-inner border border-slate-100 hover:border-blue-200 transition-all">
                      <input type="radio" name="analysisType" value="engagement" checked={selectedAnalysisType === 'engagement'} onChange={() => { setSelectedAnalysisType('engagement'); setAnalysisResult(null); setError(null); }} className="form-radio text-blue-600 h-4 w-4" aria-label="اختيار تحليل تعزيز التفاعل" />
                      <span className="text-xs font-black text-slate-700">تعزيز التفاعل</span>
                    </label>
                     <label className="flex items-center col-span-2 cursor-pointer gap-2 p-3 bg-red-50/5 rounded-xl shadow-inner border border-red-100 hover:border-blue-200 transition-all">
                      <input type="radio" name="analysisType" value="blogger_speed" checked={selectedAnalysisType === 'blogger_speed'} onChange={() => { setSelectedAnalysisType('blogger_speed'); setAnalysisResult(null); setError(null); }} className="form-radio text-red-600 h-4 w-4" aria-label="اختيار تحليل سرعة Blogger" />
                      <span className="text-xs font-black text-red-700">تحليل سرعة Blogger</span>
                    </label>
                    <label className="flex items-center col-span-2 cursor-pointer gap-2 p-3 bg-purple-50/5 rounded-xl shadow-inner border border-purple-100 hover:border-blue-200 transition-all">
                      <input type="radio" name="analysisType" value="blogger_template_plan" checked={selectedAnalysisType === 'blogger_template_plan'} onChange={() => { setSelectedAnalysisType('blogger_template_plan'); setAnalysisResult(null); setError(null); }} className="form-radio text-purple-600 h-4 w-4" aria-label="اختيار خطة وتدقيق قالب Blogger" />
                      <span className="text-xs font-black text-purple-700">خطة وتدقيق قالب Blogger</span>
                    </label>
                  </div>

                  {isBloggerSpecificAnalysis && (
                    <div className="mt-4 space-y-3">
                       <input 
                         type="url"
                         value={bloggerUrl}
                         onChange={(e) => setBloggerUrl(e.target.value)}
                         placeholder="https://your-blog.blogspot.com/"
                         className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-medium text-center focus:border-purple-600 outline-none shadow-inner"
                         aria-label="رابط مدونة Blogger"
                       />
                       <p className="text-[10px] text-slate-500 font-bold">يرجى إدخال الرابط الرئيسي لمدونة Blogger خاصتك.</p>
                    </div>
                  )}

                  {posts.length === 0 && !isBloggerSpecificAnalysis && (
                    <p className="text-red-500 text-xs mt-4">⚠️ لا توجد مقالات في مدونتك لتحليلها. يرجى إضافة مقالات أولاً.</p>
                  )}
                  {posts.length > 0 && !isBloggerSpecificAnalysis && (
                    <p className="text-emerald-600 text-xs mt-4">✅ سيتم تحليل {posts.length} مقال.</p>
                  )}
                  
                </div>

                {ga4MeasurementId ? (
                    <div className="bg-emerald-50 p-4 rounded-xl text-xs font-black text-emerald-700 border border-emerald-100 shadow-inner text-center">
                        ✅ GA4 متصل: <span className="underline">{ga4MeasurementId}</span>
                    </div>
                ) : (
                    <div className="bg-orange-50 p-4 rounded-xl text-xs font-black text-orange-700 border border-orange-100 shadow-inner text-center">
                        ⚠️ GA4 غير متصل. قد يؤثر ذلك على دقة بعض التحليلات.
                    </div>
                )}
                
                <button 
                  onClick={handleAnalysis}
                  disabled={loading || (posts.length === 0 && !isBloggerSpecificAnalysis) || (isBloggerSpecificAnalysis && !bloggerUrl)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  aria-label="بدء التحليل الآن"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>🪄 ابدأ التحليل الآن</>
                  )}
                </button>
              </div>
            ) : ( /* deploymentHelp tab */
              <div className="space-y-6">
                 <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4">خطوات الربط النهائي</p>
                    <button onClick={() => handleDeploymentHelp('vercel')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all mb-4" aria-label="عرض تعليمات النشر على Vercel">عرض تعليمات Vercel</button>
                    <button onClick={() => handleDeploymentHelp('ga4_help')} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-red-700 transition-all mb-4" aria-label="معرفة كيفية إيجاد معرف GA4">أين أجد معرف GA4؟</button>
                    <button onClick={() => handleDeploymentHelp('blog_speed_optimization_info')} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-orange-700 transition-all mb-4" aria-label="نصائح تحسين السرعة العامة">نصائح تحسين السرعة العامة</button>
                    <div className="space-y-3 pt-4 border-t border-slate-50 mt-4">
                       <div className="flex justify-between text-[10px] font-black">
                          <span className="text-slate-500">GitHub Status</span>
                          <span className="text-emerald-500">Connected</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-black">
                          <span className="text-slate-500">Vercel Build</span>
                          <span className="text-blue-500">Automatic</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-10 mt-6">
                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                 <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">محرك أتلانتس يحلل بعمق...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 p-6 rounded-3xl text-sm font-bold text-red-700 leading-relaxed border border-red-100 shadow-md mt-6" role="alert" aria-live="assertive">
                <p><strong>خطأ:</strong> {error}</p>
                {/* إضافة تلميحات إضافية لبعض الأخطاء */}
                {error.includes("API Key مفقود أو غير صالح") && (
                   <p className="mt-2 text-xs opacity-80">
                      تأكد من أنك قمت بتعيين متغير البيئة <code>GEMINI_API_KEY</code> في إعدادات Vercel (أو بيئة النشر الخاصة بك) وأن المفتاح صحيح ونشط.
                   </p>
                )}
                {error.includes("فشل في الاتصال بخدمة Gemini") && (
                   <p className="mt-2 text-xs opacity-80">
                      يرجى التحقق من اتصالك بالإنترنت. إذا استمرت المشكلة، فقد تكون هناك مشكلة مؤقتة في خوادم Google Gemini.
                   </p>
                )}
              </div>
            )}
            {analysisResult && (
              <div className="bg-white p-6 rounded-3xl text-sm font-bold text-slate-700 leading-relaxed border border-slate-100 shadow-md mt-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {analysisResult}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAssistant;