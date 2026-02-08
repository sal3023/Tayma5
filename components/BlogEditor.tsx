
import React, { useState } from 'react';
import { Post } from '../types';
import { generateImageForPost } from '../services/gemini';

interface BlogEditorProps {
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onSave, onCancel }) => {
  const [loadingImg, setLoadingImg] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'تقنية',
    content: '',
    image: 'https://picsum.photos/seed/blog/1200/600',
    seoTitle: '',
    seoDescription: ''
  });

  const handleGenerateImage = async () => {
    if (!formData.title) return alert('يرجى كتابة عنوان أولاً لتوليد صورة مناسبة');
    setLoadingImg(true);
    const imgData = await generateImageForPost(formData.title);
    if (imgData) setFormData({ ...formData, image: imgData });
    setLoadingImg(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      ...formData,
      id: Date.now().toString(),
      excerpt: formData.content.slice(0, 150) + '...',
      author: 'أنت',
      date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: `${Math.ceil(formData.content.length / 500)} دقائق`,
      views: 0
    };
    onSave(newPost);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">منصة الإبداع</h1>
          <p className="text-slate-500 font-bold">صغ أفكارك وحولها إلى محتوى عالمي.</p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">عنوان المقال الاستراتيجي</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 outline-none text-2xl font-black transition-all bg-slate-50/30 focus:bg-white"
                  placeholder="اكتب عنواناً يهز الصناعة..."
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">التصنيف</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 font-bold bg-slate-50/30"
                >
                  <option>تقنية</option>
                  <option>تصميم</option>
                  <option>تسويق</option>
                  <option>ريادة أعمال</option>
                </select>
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">هوية المقال البصرية</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="flex-1 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 text-sm font-bold bg-slate-50/30"
                  placeholder="رابط الصورة أو ولّد واحدة..."
                />
                <button 
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={loadingImg}
                  className="px-8 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all disabled:bg-slate-200 flex items-center gap-2"
                >
                  {loadingImg ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : '🪄 ولّد صورة ذكية'}
                </button>
              </div>
              <div className="mt-6 rounded-3xl overflow-hidden border-2 border-slate-50 shadow-inner h-64 bg-slate-50 flex items-center justify-center">
                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">متن المقال</label>
              <textarea 
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full border-2 border-slate-100 rounded-[2rem] px-8 py-8 focus:border-blue-600 outline-none leading-[1.8] text-lg font-medium bg-slate-50/30 focus:bg-white transition-all"
                placeholder="ابدأ بسرد قصتك الملهمة هنا..."
              ></textarea>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-12 text-white shadow-2xl">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
              <span className="p-3 bg-white/10 rounded-2xl">🔍</span> مركز تحسين السيو (SEO)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">SEO Title</label>
                  <input 
                    type="text" 
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500 text-sm transition-all"
                    placeholder="عنوان محركات البحث..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Meta Description</label>
                  <textarea 
                    rows={4}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500 text-sm transition-all"
                    placeholder="وصف يجذب النقرات..."
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="p-8 bg-white rounded-3xl text-slate-900 border border-white/20">
                  <p className="text-[10px] text-slate-400 mb-1 font-bold">المعاينة الحية لنتائج Google</p>
                  <h4 className="text-blue-600 text-xl font-bold hover:underline cursor-pointer mb-2 truncate">
                    {formData.seoTitle || formData.title || 'عنوان المقال سيظهر هنا'}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {formData.seoDescription || formData.content.slice(0, 160) || 'وصف المقال سيظهر هنا لجذب القراء من محركات البحث العالمية...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-10 border-t border-slate-100">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all text-xl active:scale-95"
            >
              نشر المقال للعالم
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="px-12 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
