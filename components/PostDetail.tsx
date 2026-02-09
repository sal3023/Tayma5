
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
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTranslate = async (lang: string) => {
    if (lang === 'ar' && displayContent === post.content) return;
    if (lang === 'ar') {
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

  const handleAiSummary = async () => {
    setLoadingSummary(true);
    const res = await generatePostSummary(post.content);
    setSummary(res || '');
    setLoadingSummary(false);
  };

  return (
    <div className={`transition-all duration-500 min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <div className="fixed top-0 right-0 h-1.5 bg-blue-600 z-[100] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        <div className="flex flex-wrap justify-between items-center mb-12 gap-6 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100 backdrop-blur-md sticky top-24 z-50">
          <button onClick={onBack} className="group flex items-center gap-3 font-black text-sm hover:text-blue-600 transition-all">
            <span className="group-hover:translate-x-1 transition-transform">→</span> رجوع
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
               {['ar', 'en', 'fr'].map(l => (
                 <button key={l} onClick={() => handleTranslate(l)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${((displayContent === post.content && l === 'ar') || (displayContent !== post.content && l !== 'ar')) ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
                   {l}
                 </button>
               ))}
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-500'}`}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handlePlayAudio} disabled={loadingAudio} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-xs transition-all border shadow-lg ${isPlaying ? 'bg-red-500 text-white border-red-400' : 'bg-slate-900 text-white border-slate-800 hover:bg-blue-600'}`}>
              {loadingAudio ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : isPlaying ? '⏹ إيقاف' : '🔊 استماع'}
            </button>
          </div>
        </div>

        <article className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <AdUnit type="leaderboard" />
          
          <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-16 group">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-12 w-full text-right">
              <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black mb-6 inline-block uppercase tracking-widest shadow-xl shadow-blue-500/30">
                {post.category} • سوق {post.targetMarket || 'عالمي'}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-4 drop-shadow-2xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-white/70 text-sm font-bold">
                 <div className="flex items-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                     {post.author[0]}
                   </div>
                   <span>{post.author}</span>
                 </div>
                 <div className="w-1 h-1 bg-white/30 rounded-full" />
                 <span>{post.date}</span>
                 <div className="w-1 h-1 bg-white/30 rounded-full" />
                 <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-12">
            <div className={`rounded-[2.5rem] p-10 mb-16 border-2 transition-all duration-500 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-blue-50/30 border-blue-100 text-slate-700'}`}>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-black flex items-center gap-3 text-xl">
                  <span className="text-3xl">✨</span> ملخص "أتلانتس" الذكي
                </h3>
                {!summary && (
                  <button onClick={handleAiSummary} disabled={loadingSummary} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-xl hover:scale-105 transition-all">
                    {loadingSummary ? 'جاري التحليل...' : 'توليد ملخص'}
                  </button>
                )}
              </div>
              {summary ? <div className="prose prose-slate leading-relaxed text-lg font-bold italic relative z-10">{summary}</div> : <p className="text-sm font-medium opacity-60">استخلص الجوهر المعرفي لهذا المقال بضغطة واحدة.</p>}
            </div>

            <div className={`prose prose-2xl max-w-none transition-colors duration-500 ${isDarkMode ? 'prose-invert text-slate-300' : 'prose-slate text-slate-800'}`}>
              {translating ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6 animate-pulse">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">AI Translation...</p>
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {displayContent}
                </ReactMarkdown>
              )}
            </div>

            <AdUnit type="rectangle" />
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
