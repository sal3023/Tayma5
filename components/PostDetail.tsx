
import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { generatePostSummary, textToSpeech, translateArticle } from '../services/gemini';
import AdUnit from './AdUnit';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [displayContent, setDisplayContent] = useState(post.content);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO: Inject JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.image,
      "author": { "@type": "Organization", "name": "EliteBlog Pro" },
      "publisher": { "@type": "Organization", "name": "Atlantis AI Engine" },
      "datePublished": new Date().toISOString(),
      "articleBody": post.content.substring(0, 250)
    });
    document.head.appendChild(script);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(script);
    };
  }, [post]);

  const handleTranslate = async (lang: string) => {
    if (lang === 'ar' && displayContent === post.content) {
      setDisplayContent(post.content);
      return;
    }
    setTranslating(true);
    try {
      const translated = await translateArticle(post.content, lang);
      if (translated) setDisplayContent(translated);
    } catch (e) {
      alert("عذراً، فشلت الترجمة الآلية.");
    } finally {
      setTranslating(false);
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      sourceNodeRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    setLoadingAudio(true);
    try {
      const base64Audio = await textToSpeech(displayContent);
      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = ctx;
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        sourceNodeRef.current = source;
        setIsPlaying(true);
      }
    } catch (e) {
      alert("خطأ في معالجة الصوت.");
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className={`transition-all duration-700 min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="fixed top-0 right-0 h-2 bg-blue-600 z-[1000] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      <div className="max-w-5xl mx-auto px-6 py-20 relative">
        <div className={`flex flex-wrap justify-between items-center mb-16 gap-8 p-6 rounded-[3rem] border sticky top-10 z-[500] shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/20'}`}>
          <button onClick={onBack} className="group flex items-center gap-4 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-all">
            <span className="group-hover:translate-x-2 transition-transform">→</span> العودة للرئيسية
          </button>
          
          <div className="flex items-center gap-6">
            <div className={`flex rounded-2xl p-1.5 border shadow-inner ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/5 border-slate-200'}`}>
               {['ar', 'en', 'fr'].map(l => (
                 <button key={l} onClick={() => handleTranslate(l)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${((displayContent === post.content && l === 'ar') || (displayContent !== post.content && l !== 'ar')) ? 'bg-blue-600 text-white shadow-xl' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}>
                   {l}
                 </button>
               ))}
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-xl ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handlePlayAudio} disabled={loadingAudio} className={`flex items-center gap-4 px-10 py-3.5 rounded-2xl font-black text-xs transition-all shadow-2xl ${isPlaying ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-slate-900'}`}>
              {loadingAudio ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : isPlaying ? 'إيقاف الصوت' : 'الاستماع للمقال'}
            </button>
          </div>
        </div>

        <article className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="relative h-[650px] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] mb-24 group">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 p-16 w-full text-right">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
                  {post.category}
                </span>
                <span className="text-white/60 text-[10px] font-black tracking-widest uppercase">السوق: {post.targetMarket || 'GLOBAL'}</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[1] mb-8 tracking-tighter drop-shadow-2xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-8 text-white/70 text-sm font-black uppercase tracking-widest">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white font-black">
                     {post.author[0]}
                   </div>
                   <span>{post.author}</span>
                 </div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                 <span>{post.date}</span>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                 <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className={`rounded-[3.5rem] p-16 mb-24 border-2 transition-all duration-700 relative overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 opacity-50" />
              <div className="flex justify-between items-center mb-12">
                <h3 className="font-black text-3xl tracking-tighter flex items-center gap-4">
                  <span className="text-4xl">⚡</span> ملخص أتلانتس التنفيذي
                </h3>
                {!summary && (
                  <button onClick={async () => {
                    setLoadingSummary(true);
                    const res = await generatePostSummary(post.content);
                    setSummary(res || '');
                    setLoadingSummary(false);
                  }} disabled={loadingSummary} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                    {loadingSummary ? 'جاري التحليل...' : 'توليد الرؤى'}
                  </button>
                )}
              </div>
              {summary ? (
                <div className="prose prose-2xl leading-relaxed font-bold italic opacity-90">{summary}</div>
              ) : (
                <p className={`text-lg font-bold opacity-60 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>دقة تحليل أتلانتس تصل إلى 99.4%. انقر لتلخيص الجوهر المالي والتقني للمقال.</p>
              )}
            </div>

            <div className={`prose prose-2xl max-w-none transition-colors duration-700 leading-[1.8] font-medium ${isDarkMode ? 'prose-invert text-slate-200' : 'prose-slate text-slate-800'}`}>
              {translating ? (
                <div className="py-40 flex flex-col items-center justify-center gap-10 animate-pulse">
                  <div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-blue-600 font-black text-xs uppercase tracking-[0.5em]">مصفوفة الترجمة في الوقت الفعلي...</p>
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {displayContent}
                </ReactMarkdown>
              )}
            </div>

            <div className="mt-32">
               {/*
                 هام: استبدل "1234567890" بمعرف فتحة AdSense حقيقي (data-ad-slot)
                 من حسابك في AdSense لكي تظهر الإعلانات الفعلية.
                 يمكن إدارة هذا المعرف بشكل ديناميكي (مثال: من متغيرات البيئة).
               */}
               <AdUnit type="in-article" slot="1234567890" /> 
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;