
import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { generatePostSummary, textToSpeech } from '../services/gemini';

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

  const handlePlayAudio = async () => {
    if (isPlaying) {
      sourceNodeRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    setLoadingAudio(true);
    const base64Audio = await textToSpeech(post.content);
    
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
    setLoadingAudio(false);
  };

  const handleAiSummary = async () => {
    setLoadingSummary(true);
    const res = await generatePostSummary(post.content);
    setSummary(res || '');
    setLoadingSummary(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`transition-colors duration-500 min-h-screen ${isDarkMode ? 'bg-slate-950 -mx-4 px-4 py-8' : ''}`}>
      <div className="max-w-4xl mx-auto relative">
        <div className="fixed top-0 right-0 h-1.5 bg-blue-600 z-[60] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <button 
            onClick={onBack} 
            className={`group flex items-center gap-2 font-bold transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-600'}`}
          >
            <span className="group-hover:translate-x-1 transition-transform">→</span> العودة للرئيسية
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title={isDarkMode ? 'تفعيل الوضع المضيء' : 'تفعيل الوضع الليلي'}
            >
              <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
            </button>

            <button 
              onClick={handlePlayAudio}
              disabled={loadingAudio}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl font-bold transition-all border ${
                isPlaying 
                  ? 'bg-red-50 text-red-600 border-red-100' 
                  : isDarkMode 
                    ? 'bg-blue-900/20 text-blue-400 border-blue-800 hover:bg-blue-900/40'
                    : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
              }`}
            >
              {loadingAudio ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? '⏹ إيقاف الاستماع' : '🔊 استمع للمقال'}
            </button>
          </div>
        </div>

        <article className={`rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 border ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 shadow-black/50' 
            : 'bg-white border-slate-100 shadow-slate-200/50'
        }`}>
          <div className="relative h-[450px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDarkMode ? 'from-slate-900' : 'from-white'}`} />
            <div className="absolute bottom-0 p-12 w-full">
              <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-black mb-6 inline-block uppercase tracking-widest shadow-xl shadow-blue-500/20">
                {post.category}
              </span>
              <h1 className={`text-4xl md:text-6xl font-black leading-[1.15] mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {post.title}
              </h1>
            </div>
          </div>

          <div className="p-12 pt-0">
            <div className={`flex items-center gap-6 mb-12 py-8 border-b transition-colors duration-500 ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner transition-colors duration-500 ${
                  isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900'
                }`}>
                  {post.author[0]}
                </div>
                <div>
                  <p className={`font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{post.author}</p>
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tighter">{post.date}</p>
                </div>
              </div>
              <div className={`h-8 w-px transition-colors duration-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
              <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{post.readTime} للقراءة</div>
            </div>

            <div className={`rounded-[2rem] p-10 mb-16 border relative group transition-all duration-500 ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100'
            }`}>
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 rounded-r-full" />
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-black flex items-center gap-3 text-lg ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  <span className="text-2xl">✨</span> ملخص الذكاء الاصطناعي
                </h3>
                {!summary && (
                  <button 
                    onClick={handleAiSummary}
                    disabled={loadingSummary}
                    className={`px-4 py-2 border rounded-xl text-xs font-black transition-all shadow-sm ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-blue-400 hover:border-blue-500' 
                        : 'bg-white border-slate-200 text-blue-600 hover:border-blue-300'
                    }`}
                  >
                    {loadingSummary ? 'جاري التحليل...' : 'توليد ملخص'}
                  </button>
                )}
              </div>
              {summary ? (
                <p className={`leading-relaxed text-lg font-medium italic ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>"{summary}"</p>
              ) : (
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>احصل على جوهر المقال في بضع جمل ذكية.</p>
              )}
            </div>

            <div className={`prose prose-xl max-w-none leading-[1.8] font-medium whitespace-pre-wrap transition-colors duration-500 ${
              isDarkMode ? 'prose-invert text-slate-300' : 'prose-slate text-slate-700'
            }`}>
              {post.content}
            </div>

            <div className={`mt-20 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 transition-colors duration-500 ${
              isDarkMode ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex gap-4">
                {['تويتر', 'لينكد إن', 'واتساب'].map(p => (
                  <button 
                    key={p} 
                    className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
                      isDarkMode 
                        ? 'bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white' 
                        : 'bg-slate-50 text-slate-900 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors duration-500 ${
                isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
              }`}>
                {post.views.toLocaleString()} مشاهدة
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
