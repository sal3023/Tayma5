
import React, { useState, useEffect } from 'react';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(1450.75);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleWithdraw = () => {
    setWithdrawalLoading(true);
    setTimeout(() => {
      alert("✅ تم إرسال طلب السحب إلى Google AdSense بقيمة $" + balance.toFixed(2));
      setWithdrawalLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-2">محفظة الأرباح الذكية 💸</h1>
          <p className="text-slate-500 font-bold">إدارة العوائد المالية من AdSense والأتمتة.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">متصل بـ AdSense المباشر</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[3.5rem] p-12 text-white shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] opacity-60 mb-2">الرصيد الكلي القابل للسحب</p>
                  <h2 className="text-7xl font-black tracking-tighter">${balance.toLocaleString()}</h2>
                </div>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">🏦</div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/10 mb-8">
                <div>
                   <p className="text-[9px] font-black opacity-50 uppercase tracking-widest mb-1">أرباح اليوم</p>
                   <p className="text-2xl font-black text-emerald-300">+$42.50</p>
                </div>
                <div>
                   <p className="text-[9px] font-black opacity-50 uppercase tracking-widest mb-1">المشاهدات المربحة</p>
                   <p className="text-2xl font-black">12.4K</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleWithdraw}
                  disabled={withdrawalLoading}
                  className="flex-1 bg-white text-emerald-900 py-6 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                >
                  {withdrawalLoading ? 'جاري السحب...' : 'سحب الأرباح الآن'}
                </button>
                <button className="bg-emerald-400/20 border border-emerald-400/30 text-white px-8 py-6 rounded-2xl font-black text-sm hover:bg-emerald-400/30 transition-all">
                  تفاصيل العائد
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black">سجل العمليات المالية</h3>
                <button onClick={() => setShowHistory(!showHistory)} className="text-xs font-black text-blue-600">عرض الكل</button>
             </div>
             
             <div className="space-y-4">
                {[
                  { id: '1', type: 'Deposit', source: 'AdSense USA Views', amount: 120.40, date: 'منذ ساعتين', status: 'Completed' },
                  { id: '2', type: 'Deposit', source: 'Premium Ad Clicks', amount: 45.10, date: 'منذ 5 ساعات', status: 'Completed' },
                  { id: '3', type: 'Withdrawal', source: 'Bank Account (Transfer)', amount: -500.00, date: 'أمس', status: 'Pending' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {item.amount > 0 ? '↓' : '↑'}
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-800">{item.source}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-left">
                       <p className={`font-black ${item.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                         {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)}$
                       </p>
                       <p className="text-[8px] font-black uppercase text-slate-400">{item.status}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
              <h3 className="text-xl font-black mb-6">بطاقة الناشر 💳</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">معرف الحساب</p>
                    <p className="font-mono text-xs text-blue-400">ca-pub-9209979470286545</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">العملة الأساسية</p>
                    <p className="text-sm font-black uppercase">USD - دولار أمريكي</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">طريقة السحب الحالية</p>
                    <p className="text-sm font-black">Bank Transfer (SWIFT)</p>
                 </div>
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest">تعديل بيانات الدفع</button>
              </div>
           </div>

           <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl">
              <h4 className="text-lg font-black mb-4">نصيحة أتلانتس 💡</h4>
              <p className="text-xs font-medium leading-relaxed opacity-90 mb-6">
                "المقالات التي تستهدف قطاع 'تأمين السيارات' في أمريكا تجلب حالياً $25 لكل 1000 مشاهدة. قم بإنتاج 3 مقالات في هذا القسم لمضاعفة رصيدك."
              </p>
              <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs">اذهب للترندات الآن</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
