
import React, { useState } from 'react';
import { analyzeBlogGaps } from '../services/gemini';
import { Post } from '../types';

interface SmartAssistantProps {
  posts: Post[];
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ posts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'deploy'>('audit');

  const systemStatus = {
    gemini: !!process.env.API_KEY,
    vercel: true,
    github: 'Connected',
    lastSync: new Date().toLocaleTimeString('ar-EG')
  };

  const handleAudit = async (type: 'gaps' | 'vercel') => {
    setLoading(true);
    setSuggestions(null);
    
    if (type === 'gaps') {
      const res = await analyzeBlogGaps(posts);
      setSuggestions(res);
    } else {
      setTimeout(() => {
        setSuggestions(`
🚀 **دليل النشر على Vercel:**
1. اذهب إلى Vercel.com واربط مستودع GitHub الخاص بك.
2. في إعدادات المشروع (Settings > Environment Variables):
3. أضف مفتاح جديد باسم **API_KEY**.
4. ضع قيمة مفتاح Gemini الخاص بك هناك.
5. اضغط **Deploy**.. وسيتم تحديث تطبيقك آلياً مع كل "Push" للـ GitHub!
        `);
        setLoading(false);
      }, 800);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[999]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 active:scale-95 border-4 border-white"
        >
          <span className="text-2xl">{isOpen ? '✕' : '🤖'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-[90vw] max-w-[400px] h-[550px] bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.25)] border border-slate-200 flex flex-col z-[999] overflow-hidden animate-in slide-in-from-bottom-5">
          <header className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-sm flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                أتلانتس: مركز القيادة
              </h3>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('audit')}
                className={`flex-1 text-[10px] font-black py-3 rounded-xl transition-all ${activeTab === 'audit' ? 'bg-blue-600 shadow-lg' : 'text-slate-500 bg-white/5'}`}
              >
                تحليل الفجوات
              </button>
              <button 
                onClick={() => setActiveTab('deploy')}
                className={`flex-1 text-[10px] font-black py-3 rounded-xl transition-all ${activeTab === 'deploy' ? 'bg-indigo-600 shadow-lg' : 'text-slate-500 bg-white/5'}`}
              >
                ربط الاستضافة
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            {activeTab === 'deploy' ? (
              <div className="space-y-6">
                 <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4">خطوات الربط النهائي</p>
                    <button onClick={() => handleAudit('vercel')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all mb-4">عرض تعليمات Vercel</button>
                    <div className="space-y-3">
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
                 {suggestions && (
                    <div className="bg-blue-50 p-6 rounded-3xl text-xs font-bold text-blue-900 leading-relaxed border border-blue-100 whitespace-pre-wrap">
                      {suggestions}
                    </div>
                 )}
              </div>
            ) : (
              <div className="space-y-4">
                {!suggestions && !loading && (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-6">🔍</div>
                    <p className="text-slate-500 font-bold text-sm mb-6 leading-relaxed">سأقوم الآن بتحليل مدونتك لاكتشاف المواضيع التي لم تغطيها بعد لزيادة أرباحك.</p>
                    <button onClick={() => handleAudit('gaps')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-slate-900 transition-all">بدأ تحليل المحتوى</button>
                  </div>
                )}
                {loading && (
                  <div className="text-center py-20">
                     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                     <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">تحليل مصفوفة البيانات...</p>
                  </div>
                )}
                {suggestions && activeTab === 'audit' && (
                  <div className="bg-white p-6 rounded-3xl text-sm font-bold text-slate-700 leading-relaxed border border-slate-100 shadow-md">
                    {suggestions}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAssistant;
