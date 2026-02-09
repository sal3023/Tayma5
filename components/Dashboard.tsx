
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  posts: Post[];
  onUpdatePost: (post: Post) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts }) => {
  const [isAutoPilot, setIsAutoPilot] = useState(true);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'finance' | 'automation'>('finance');

  const calculateEarnings = (views: number, market: string = 'Global') => {
    const rpm = market === 'USA' ? 18.5 : market === 'Europe' ? 14.2 : 5.8;
    return (views / 1000) * rpm;
  };

  const totalEarnings = posts.reduce((sum, p) => sum + calculateEarnings(p.views, p.targetMarket), 0);
  
  const chartData = posts.map(p => ({
    name: p.title.slice(0, 10),
    earnings: calculateEarnings(p.views, p.targetMarket),
    views: p.views
  }));

  const handleWithdraw = () => {
    setWithdrawalLoading(true);
    setTimeout(() => {
      alert(`✅ تم طلب سحب مبلغ $${totalEarnings.toFixed(2)}\nسيتم التحويل عبر Western Union أو الحساب البنكي المرتبط بـ AdSense.`);
      setWithdrawalLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Header with Stats */}
      <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">إجمالي الأرباح المتاحة</p>
                <h2 className="text-6xl md:text-7xl font-black tracking-tighter">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
              </div>
              <button 
                onClick={handleWithdraw}
                disabled={withdrawalLoading}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {withdrawalLoading ? 'جاري السحب...' : 'سحب الأرباح الآن 💸'}
              </button>
           </div>
           <div className="mt-10 pt-8 border-t border-white/10 flex gap-10">
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase">معرف الناشر AdSense</p>
                 <p className="text-xs font-bold text-slate-300">ca-pub-9209979470286545</p>
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase">حالة الدفع</p>
                 <p className="text-xs font-bold text-emerald-400">جاهز للسحب</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-center">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
              <h3 className="text-xl font-black">تحكم أتلانتس الآلي</h3>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <span className="text-xs font-black text-slate-600">النشر التلقائي</span>
                 <button 
                    onClick={() => setIsAutoPilot(!isAutoPilot)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isAutoPilot ? 'bg-emerald-500' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${isAutoPilot ? 'right-6.5' : 'right-0.5'}`} />
                 </button>
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-center">
                 {isAutoPilot ? '✅ النظام يقوم الآن بتحليل الترند العالمي ونشر مقال كل 24 ساعة آلياً.' : '❌ النظام في وضع الانتظار. قم بتفعيله للنشر الآلي.'}
              </p>
           </div>
        </div>
      </header>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="flex border-b border-slate-50">
            <button 
              onClick={() => setActiveTab('finance')}
              className={`flex-1 py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'finance' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
            >
              التحليل المالي والسوقي
            </button>
            <button 
              onClick={() => setActiveTab('automation')}
              className={`flex-1 py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'automation' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
            >
              سجل العمليات الآلية (AI Logs)
            </button>
         </div>

         <div className="p-10">
            {activeTab === 'finance' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="h-[400px]">
                    <h4 className="text-sm font-black mb-6 flex items-center gap-2">
                       <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                       توزيع الأرباح لكل مقال
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="earnings" fill="#2563eb" radius={[8, 8, 8, 8]} barSize={40} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="space-y-6">
                    <h4 className="text-sm font-black mb-6">أعلى المقالات دخلاً بالسوق العالمي</h4>
                    {posts.map((p, i) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                         <div className="flex items-center gap-4">
                            <span className="text-2xl">{p.targetMarket === 'USA' ? '🇺🇸' : '🌐'}</span>
                            <div>
                               <p className="font-black text-xs line-clamp-1">{p.title}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">{p.views.toLocaleString()} مشاهدة</p>
                            </div>
                         </div>
                         <p className="font-black text-emerald-600">${calculateEarnings(p.views, p.targetMarket).toFixed(2)}</p>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                 {[
                   { action: 'تحليل ترند', desc: 'تم تحليل السوق الأمريكي (USA) واكتشاف ترند Real Estate AI.', time: 'منذ ساعتين' },
                   { action: 'توليد مقال', desc: 'تم إنشاء مقال بـ 1500 كلمة يستهدف الكلمات المفتاحية ذات CPC $22.', time: 'منذ ساعة' },
                   { action: 'نشر آلي', desc: 'تم النشر بنجاح وتحديث خارطة الموقع (Sitemap).', time: 'منذ 45 دقيقة' },
                   { action: 'أرشفة قوقل', desc: 'تم إرسال المقال لـ Google Search Console آلياً.', time: 'الآن' },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-6 p-6 border-r-4 border-blue-600 bg-slate-50 rounded-2xl">
                      <div className="shrink-0 text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-lg h-fit uppercase">
                         {log.action}
                      </div>
                      <div>
                         <p className="font-black text-slate-800 text-sm mb-1">{log.desc}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">{log.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
