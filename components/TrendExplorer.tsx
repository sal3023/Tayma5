
import React, { useState, useEffect } from 'react';
import { fetchGlobalTrends } from '../services/gemini';
import { TrendIdea } from '../types';

interface TrendExplorerProps {
  onStartArticle: (idea: TrendIdea) => void;
}

const TrendExplorer: React.FC<TrendExplorerProps> = ({ onStartArticle }) => {
  const [trends, setTrends] = useState<TrendIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('تمويل وتقنية');
  const [region, setRegion] = useState('USA');

  const getTrends = async () => {
    setLoading(true);
    const data = await fetchGlobalTrends(category, region);
    setTrends(data);
    setLoading(false);
  };

  useEffect(() => {
    getTrends();
  }, [category, region]);

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-emerald-100">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          رادار الأرباح العالمي المباشر
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">اقتنص فرص الـ CPC العالي</h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto font-bold leading-relaxed">
          نحلل بيانات الأسواق في <span className="text-blue-600">أمريكا وأوروبا</span> لنعطيك مواضيع تضمن أعلى عائد من الإعلانات.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-center gap-10 mb-20 px-4">
        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">تغيير السوق</label>
           <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[2rem]">
              {['USA', 'Europe', 'Asia', 'MENA'].map(r => (
                <button 
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-8 py-3 rounded-[1.5rem] font-black text-xs transition-all ${region === r ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}
                >
                  {r}
                </button>
              ))}
           </div>
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">القطاع الربحي</label>
           <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[2rem] overflow-x-auto no-scrollbar">
              {['تمويل وتقنية', 'تأمين', 'عقارات', 'ذكاء اصطناعي'].map(c => (
                <button 
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-8 py-3 rounded-[1.5rem] font-black text-xs transition-all whitespace-nowrap ${category === c ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500'}`}
                >
                  {c}
                </button>
              ))}
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-8">
          <div className="w-24 h-24 border-8 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
          <p className="text-blue-600 font-black animate-pulse uppercase tracking-[0.5em] text-xs">Scanning Global Market Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {trends.map((trend, idx) => (
            <div key={idx} className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-blue-500/10 transition-all group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-3 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <span>High CPC: {trend.estimatedCPC}</span>
                 <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
              
              <div className="mt-6 mb-8">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full">
                    {trend.region} Target
                 </span>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                {trend.topic}
              </h3>
              
              <p className="text-slate-500 font-bold text-sm leading-relaxed mb-10 flex-1">
                {trend.reason}
              </p>

              <div className="space-y-6 mb-12">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مفاتيح الأرباح</p>
                <div className="flex flex-wrap gap-2">
                  {trend.keywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-black text-slate-700 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onStartArticle(trend)}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl shadow-slate-200"
              >
                🪄 تحويل لنيش مربح فوراً
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendExplorer;
