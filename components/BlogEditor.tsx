
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
  const [seoScore, setSeoScore] = useState(0);
  
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
    // Live SEO Calculation
    let score = 0;
    if (formData.title.length > 40) score += 20;
    if (formData.content.length > 1000) score += 30;
    if (formData.content.length > 4000) score += 20;
    if (formData.content.includes('#')) score += 15; // Markdown headings
    if (formData.image.startsWith('data:')) score += 15; // Custom image
    setSeoScore(score);
  }, [formData.content, formData.title, formData.image]);

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
      profitScore: seoScore
    };
    onSave(newPost);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-100">
        <header className="mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">محرر الأرباح "أتلانتس" 🚀</h1>
            <div className="flex items-center gap-6">
               <p className="text-slate-500 font-bold text-lg">استهداف الأسواق العالمية بأقوى الكلمات المفتاحية.</p>
               <div className="flex items-center gap-3 px-5 py-2 bg-slate-900 rounded-2xl">
                  <span className="text-white text-[10px] font-black uppercase">SEO SCORE</span>
                  <span className={`text-xl font-black ${seoScore > 70 ? 'text-emerald-400' : 'text-orange-400'}`}>{seoScore}%</span>
               </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleAiWrite}
            disabled={loadingAI}
            className="w-full lg:w-auto bg-blue-600 text-white px-12 py-6 rounded-3xl font-black shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loadingAI ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : "توليد مقال ذكي"}
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Target Market and Category row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">السوق المستهدف</label>
                <div className="flex gap-2">
                   {['Global', 'USA', 'Europe'].map(m => (
                     <button key={m} type="button" onClick={() => setFormData({...formData, targetMarket: m as any})} className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${formData.targetMarket === m ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{m}</button>
                   ))}
                </div>
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">القسم</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3 font-black text-xs outline-none">
                   {['تقنية', 'اقتصاد', 'عقارات', 'صحة'].map(c => <option key={c}>{c}</option>)}
                </select>
             </div>
          </div>

          <input 
            required
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border-b-4 border-slate-50 focus:border-blue-600 outline-none text-4xl font-black py-6 transition-all bg-transparent"
            placeholder="اكتب العنوان هنا..."
          />

          <div className="relative rounded-[3rem] overflow-hidden h-96 bg-slate-50">
             <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
             <button type="button" onClick={handleGenerateImage} disabled={loadingImg} className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md text-slate-900 px-6 py-3 rounded-2xl font-black text-xs shadow-2xl hover:scale-105 transition-all">
                {loadingImg ? 'جاري التوليد...' : '🪄 تغيير الصورة بالذكاء الاصطناعي'}
             </button>
          </div>

          <textarea 
            required
            rows={20}
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full border-2 border-slate-50 rounded-[3rem] px-10 py-10 focus:border-blue-600 outline-none leading-relaxed text-lg font-medium bg-slate-50/20"
            placeholder="ابدأ الكتابة..."
          ></textarea>

          <div className="flex gap-4 pt-10">
            <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-6 rounded-3xl shadow-2xl hover:bg-blue-600 transition-all text-xl">نشر المقال عالمياً</button>
            <button type="button" onClick={onCancel} className="px-10 py-6 text-slate-400 font-black">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
