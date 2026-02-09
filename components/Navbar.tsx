
import React, { useState, useEffect } from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const marketUpdates = [
    "🚀 ترند جديد: AI Stocks في تصاعد مستمر (+14%)",
    "💰 أعلى CPC حالياً: 'Cloud Computing' يصل لـ $45 للنقرة",
    "🌍 تنبيه: زيادة مشاهدات من منطقة ألمانيا (Europe Market)",
    "⚙️ أتلانتس: تم نشر 3 مقالات آلياً خلال الـ 24 ساعة الماضية"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % marketUpdates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert("✅ تم تحديث بيانات الأرباح والأرشفة بنجاح!");
    }, 1500);
  };

  return (
    <div className="sticky top-0 z-[200]">
      {/* Global Market Ticker */}
      <div className="bg-slate-900 py-2.5 px-4 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-4">
           <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shrink-0">Live Update</span>
           <p className="text-white text-[10px] font-bold tracking-tight animate-in slide-in-from-right-10 duration-500" key={tickerIndex}>
             {marketUpdates[tickerIndex]}
           </p>
        </div>
      </div>

      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center gap-6 md:gap-10">
              <div 
                className="text-2xl md:text-3xl font-black text-slate-900 cursor-pointer flex items-center gap-3 group"
                onClick={() => setView(ViewMode.HOME)}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-2xl group-hover:rotate-12 transition-transform shadow-xl shadow-blue-500/30 flex items-center justify-center text-white text-xl font-black">E</div>
                <span className="hidden sm:inline tracking-tighter">EliteBlog</span>
              </div>
              
              <div className="hidden lg:flex items-center gap-4">
                <button
                  onClick={() => setView(ViewMode.HOME)}
                  className={`text-xs font-black uppercase px-4 py-2 rounded-xl transition-all ${currentView === ViewMode.HOME ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  الرئيسية
                </button>
                <button
                  onClick={() => setView(ViewMode.TRENDS)}
                  className={`text-xs font-black uppercase px-4 py-2 rounded-xl transition-all ${currentView === ViewMode.TRENDS ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  الترندات
                </button>
                <button
                  onClick={() => setView(ViewMode.WALLET)}
                  className={`text-xs font-black uppercase px-6 py-2 rounded-xl transition-all flex items-center gap-2 ${currentView === ViewMode.WALLET ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                >
                  <span>💰</span> المحفظة والأرباح
                </button>
                <button
                  onClick={() => setView(ViewMode.DASHBOARD)}
                  className={`text-xs font-black uppercase px-4 py-2 rounded-xl transition-all ${currentView === ViewMode.DASHBOARD ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  التحكم الآلي
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className={`p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all ${isUpdating ? 'animate-spin' : ''}`}
                title="تحديث البيانات"
              >
                🔄
              </button>
              <button
                onClick={() => setView(ViewMode.EDITOR)}
                className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-xs font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95"
              >
                نشر مقال جديد
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
