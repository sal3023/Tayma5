
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { generateImageForPost, generateFullArticle } from '../services/gemini';

interface BlogEditorProps {
  onSave: (post: Post) => void;
  onCancel: () => void;
  initialData?: Partial<Post>;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onSave, onCancel, initialData }) => {
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [charCount, setCharCount] = useState(0);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'تقنية',
    content: initialData?.content || '',
    image: initialData?.image || 'https://picsum.photos/seed/blog/1200/600',
    targetMarket: (initialData?.targetMarket as any) || 'Global',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || ''
  });

  useEffect(() => {
    setCharCount(formData.content.length);
  }, [formData.content]);

  const handleGenerateImage = async () => {
    if (!formData.title) return alert('يرجى كتابة عنوان أولاً');
    setLoadingImg(true);
    setStatusMsg('توليد غلاف بصري متوافق مع الأسواق العالمية...');
    try {
      const imgData = await generateImageForPost(formData.title);
      if (imgData) setFormData({ ...formData, image: imgData });
    } finally {
      setLoadingImg(false);
      setStatusMsg('');
    }
  };

  const handleAiWrite = async () => {
    if (!formData.title) return alert('يرجى تحديد عنوان الموضوع');
    setLoadingAI(true);
    setStatusMsg(`جاري تحليل السوق (${formData.targetMarket}) وكتابة المحتوى المربح...`);
    try {
      const result = await generateFullArticle(formData.title, formData.category, formData.targetMarket);
      if (result && result.content) {
        setFormData({ ...formData, content: result.content });
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingAI(false);
      setStatusMsg('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      ...formData,
      id: Date.now().toString(),
      excerpt: formData.content.slice(0, 250).replace(/[#*`]/g, '') + '...',
      author: 'محرك أتلانتس الاستراتيجي',
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: `${Math.ceil(formData.content.split(' ').length / 160)} دقائق قراءة`,
      views: 0,
      profitScore: Math.min(100, Math.floor(formData.content.length / 50)) // simple heuristic
    };
    onSave(newPost);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
        <header className="mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Global Engine</span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">محرر الأرباح "أتلانتس"</h1>
            </div>
            <p className="text-slate-500 font-bold text-lg">استهداف الأسواق العالمية (USA/Europe) بكلمات مفتاحية عالية العائد.</p>
            {statusMsg && (
              <div className="mt-6 flex items-center gap-3 text-blue-600 font-black animate-pulse bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                {statusMsg}
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={handleAiWrite}
            disabled={loadingAI}
            className="w-full lg:w-auto bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loadingAI ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : "🚀 توليد مقال عالمي مربح"}
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">السوق المستهدف</label>
               <div className="flex flex-wrap gap-2">
                 {['Global', 'USA', 'Europe', 'MENA'].map(m => (
                   <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({...formData, targetMarket: m as any})}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${formData.targetMarket === m ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                   >
                     {m}
                   </button>
                 ))}
               </div>
            </div>
            <div className="lg:col-span-1 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">القسم</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border-2 border-slate-100 rounded-[2rem] px-8 py-4 outline-none focus:border-blue-600 font-black bg-slate-50/50 appearance-none shadow-inner"
              >
                {['تقنية', 'اقتصاد', 'تمويل وبنوك', 'عقارات', 'تأمين', 'صحة'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="lg:col-span-1 space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">مؤشر الربحية المتوقع</label>
               <div className="h-12 bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex items-center px-6 gap-3">
                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${charCount > 5000 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                    style={{ width: `${Math.min(100, charCount/60)}%` }} 
                   />
                 </div>
                 <span className="text-[10px] font-black text-slate-500">
                    {charCount > 5000 ? 'الحد الأقصى 🔥' : `${Math.floor(charCount/60)}%`}
                 </span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">العنوان الاستراتيجي</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border-b-8 border-slate-50 focus:border-blue-600 outline-none text-4xl font-black py-6 transition-all bg-transparent"
              placeholder="مثال: كيف تستثمر في العقارات الرقمية في أوروبا 2025"
            />
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">الغلاف البصري العالمي (8K)</label>
              <button 
                type="button"
                onClick={handleGenerateImage}
                disabled={loadingImg}
                className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-3 bg-blue-50 px-5 py-2 rounded-full"
              >
                {loadingImg ? 'جاري التوليد...' : '🪄 ولّد صورة سينمائية'}
              </button>
            </div>
            <div className="relative group rounded-[3rem] overflow-hidden h-[500px] bg-slate-50 border-4 border-slate-50 shadow-inner">
              <img src={formData.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Preview" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                 <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-3/4 bg-white/95 border-none rounded-2xl px-8 py-5 text-sm font-black shadow-3xl outline-none text-center"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">المحتوى المرجعي (Markdown)</label>
              <div className="text-[10px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full">
                {charCount.toLocaleString()} حرف
              </div>
            </div>
            <textarea 
              required
              rows={25}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full border-2 border-slate-100 rounded-[3rem] px-12 py-12 focus:border-blue-600 outline-none leading-[2.2] text-xl font-medium bg-slate-50/10 transition-all shadow-inner"
              placeholder="اكتب بذكاء، استهدف الأرباح..."
            ></textarea>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 pt-12 border-t border-slate-100">
            <button type="submit" className="flex-2 bg-slate-900 text-white font-black py-7 px-16 rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all text-2xl active:scale-95 shadow-slate-200">
              نشر وأتمتة الأرشفة العالمية
            </button>
            <button type="button" onClick={onCancel} className="flex-1 border-4 border-slate-50 text-slate-300 font-black rounded-[2.5rem] hover:bg-slate-50 transition-all text-xl">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
