
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  posts: Post[];
  onUpdatePost: (post: Post) => void;
  ga4MeasurementId: string | null;
  setGa4MeasurementId: (id: string | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, onUpdatePost, ga4MeasurementId, setGa4MeasurementId }) => {
  const [currentGa4Input, setCurrentGa4Input] = useState(ga4MeasurementId || '');

  useEffect(() => {
    setCurrentGa4Input(ga4MeasurementId || ''); // Update input field if prop changes
  }, [ga4MeasurementId]);

  const handleSaveGa4Id = () => {
    const trimmedId = currentGa4Input.trim();
    if (trimmedId && trimmedId.startsWith('G-')) {
      setGa4MeasurementId(trimmedId);
      alert('✅ تم حفظ معرف GA4 بنجاح!');
    } else if (trimmedId === '') {
      setGa4MeasurementId(null);
      alert('GA4 غير متصل. تم مسح المعرف.');
    }
    else {
      alert('⚠️ يرجى إدخال معرف GA4 صحيح (مثل G-XXXXXXXXXX).');
    }
  };

  const calculateEarnings = (views: number, market: string = 'Global') => {
    const rpm = market === 'USA' ? 28.5 : market === 'Europe' ? 19.2 : 7.5;
    return (views / 1000) * rpm;
  };

  const totalEarnings = posts.reduce((sum, p) => sum + calculateEarnings(p.views, p.targetMarket), 0);
  
  const marketStats = [
    { name: 'North America', value: 55, color: 'bg-blue-600', cpc: '$3.50' },
    { name: 'Europe', value: 25, color: 'bg-indigo-500', cpc: '$2.10' },
    { name: 'GCC & MENA', value: 15, color: 'bg-emerald-500', cpc: '$0.85' },
    { name: 'Others', value: 5, color: 'bg-slate-400', cpc: '$0.40' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-10 animate-in fade-in duration-1000">
      {/* Global Command Center Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/5">
           <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-blue-500">
                <path d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z" opacity="0.1"/>
              </svg>
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-right">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                  Atlantis AI Active
                </div>
                <h2 className="text-8xl md:text-9xl font-black tracking-tighter mb-4">
                  <span className="text-blue-500">$</span>
                  {totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
                <p className="text-slate-400 font-bold text-lg">صافي الأرباح العالمية المتوقعة (Net Global Revenue)</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button className="bg-white text-slate-900 px-12 py-7 rounded-[2.5rem] font-black text-xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 group">
                  سحب الرصيد البنكي 
                  <span className="mr-3 group-hover:translate-x-2 transition-transform inline-block">→</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                   الحساب متصل بـ Stripe & PayPal
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl flex flex-col justify-between overflow-hidden relative group">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />
           <h3 className="text-2xl font-black mb-10 relative z-10">تحليل الأسواق 🌏</h3>
           <div className="space-y-6 relative z-10">
              {marketStats.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                    <span className="text-slate-500">{m.name} ({m.cpc})</span>
                    <span className="text-slate-900">{m.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Vercel & Infrastructure Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'حالة الاستضافة', value: 'Live on Vercel', icon: '☁️', color: 'text-emerald-500' },
           { label: 'مزامنة GitHub', value: 'Auto-sync Active', icon: '🐙', color: 'text-blue-500' },
           { label: 'سرعة Edge', value: '34ms (Global)', icon: '⚡', color: 'text-orange-500' },
           { label: 'شهادة SSL', value: 'Secure (RSA)', icon: '🔒', color: 'text-indigo-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center gap-6 group hover:border-blue-200 transition-all">
             <div className="text-3xl bg-slate-50 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform">{stat.icon}</div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
             </div>
           </div>
         ))}
      </div>

      {/* Google Analytics 4 Integration Card */}
      <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-50 rounded-full text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-red-100">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            تكامل Google Analytics 4
        </div>
        <h3 className="text-3xl font-black text-slate-900 leading-tight">ربط مدونتك بـ GA4 لـ "أتلانتس"</h3>
        <p className="text-slate-500 font-bold text-lg max-w-2xl">
          أدخل معرف قياس GA4 الخاص بك (مثال: G-XXXXXXXXXX) لتتبع أداء مدونتك، الزوار، والمقالات الأكثر ربحية.
        </p>
        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            value={currentGa4Input}
            onChange={(e) => setCurrentGa4Input(e.target.value)}
            placeholder="معرف قياس GA4 (مثال: G-XXXXXXXXXX)"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 outline-none transition-all text-lg font-medium text-center shadow-inner"
          />
          <button
            onClick={handleSaveGa4Id}
            className="w-full bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-slate-900 transition-all active:scale-95"
          >
            حفظ معرف GA4
          </button>
        </div>
        <div className="text-sm font-bold mt-4">
          {ga4MeasurementId ? (
            <p className="text-emerald-600">
              ✅ GA4 متصل: <span className="underline">{ga4MeasurementId}</span>
            </p>
          ) : (
            <p className="text-orange-600">
              ⚠️ GA4 غير متصل. يرجى إدخال معرف قياس.
            </p>
          )}
          <a 
            href="https://support.google.com/analytics/answer/9744165" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline mt-2 inline-block text-xs"
          >
            كيف أجد معرف قياس GA4 الخاص بي؟
          </a>
        </div>
      </div>


      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 shadow-2xl border border-slate-100 h-[600px] flex flex-col">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <h4 className="text-2xl font-black">نمو الإمبراطورية الرقمية</h4>
                <p className="text-slate-400 font-bold text-xs uppercase mt-1">إحصائيات المشاهدات والنقرات الحقيقية</p>
              </div>
              <div className="flex gap-3 p-1.5 bg-slate-50 rounded-2xl shadow-inner border border-slate-100">
                 <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-black shadow-lg border border-blue-100">Daily</button>
                 <button className="px-6 py-2.5 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-100 hover:text-slate-900">Monthly</button>
              </div>
           </div>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={posts.map(p => ({ name: p.title.substring(0, 8), val: p.views }))}>
                  <defs>
                    <linearGradient id="atlantisGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                    itemStyle={{ fontWeight: '900', color: '#1e293b' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#atlantisGradient)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-blue-600 rounded-[4rem] p-12 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
           <div>
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-4xl mb-8 backdrop-blur-md border border-white/20">🛰️</div>
              <h4 className="text-3xl font-black mb-6">رؤية أتلانتس الذكية</h4>
              <p className="text-blue-50 leading-relaxed font-bold text-lg mb-8 opacity-90">
                بناءً على تحركات السوق في نيويورك، نقترح نشر مقال عن <span className="underline decoration-white/40">"Digital Real Estate"</span> خلال الـ 4 ساعات القادمة.
              </p>
           </div>
           <div className="space-y-4">
              <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-sm">
                 <p className="text-[10px] font-black uppercase text-blue-200 mb-2">أعلى فرصة ربح حالية</p>
                 <p className="text-xl font-black">Insurance SEO Trends 2025</p>
              </div>
              <button className="w-full py-6 bg-white text-blue-600 rounded-[2rem] font-black text-sm shadow-2xl hover:bg-slate-900 hover:text-white transition-all">تفعيل استراتيجية النشر</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;