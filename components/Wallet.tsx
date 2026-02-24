
import React, { useState } from 'react';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(2840.50);
  const [currency, setCurrency] = useState('USD');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const exchangeRates: { [key: string]: number } = { 'USD': 1, 'EUR': 0.92, 'SAR': 3.75, 'EGP': 48.50 };

  const handleWithdraw = () => {
    setWithdrawalLoading(true);
    setTimeout(() => {
      alert(`✅ تم إرسال طلب السحب بنجاح!\nالمبلغ: ${ (balance * exchangeRates[currency]).toFixed(2) } ${currency}\nالوسيلة: حوالة بنكية دولية (SWIFT)`);
      setWithdrawalLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter">المحفظة الاستراتيجية 💳</h1>
          <p className="text-slate-500 font-bold text-lg">مركز إدارة السيولة العالمية وأرباح أتلانتس.</p>
        </div>
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           {Object.keys(exchangeRates).map(curr => (
             <button 
               key={curr}
               onClick={() => setCurrency(curr)}
               className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${currency === curr ? 'bg-blue-600 text-white shadow-lg border border-blue-100' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
             >
               {curr}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Balance Card */}
          <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">الرصيد الكلي المتاح</p>
                      <h2 className="text-7xl md:text-8xl font-black tracking-tighter">
                        {currency === 'USD' ? '$' : ''}
                        {(balance * exchangeRates[currency]).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {currency !== 'USD' ? ` ${currency}` : ''}
                      </h2>
                   </div>
                   <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">💰</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/10">
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">أرباح متوقعة (30 يوم)</p>
                      <p className="text-xl font-bold text-emerald-400">+$1,240.00</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">نسبة النمو</p>
                      <p className="text-xl font-bold text-blue-400">+24.5%</p>
                   </div>
                   <button 
                     onClick={handleWithdraw}
                     disabled={withdrawalLoading}
                     className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                   >
                     {withdrawalLoading ? 'جاري السحب...' : 'طلب سحب فوري'}
                   </button>
                </div>
             </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
             <h3 className="text-xl font-black mb-8">آخر التحويلات العالمية</h3>
             <div className="space-y-4">
                {[
                  { desc: 'أرباح AdSense - الولايات المتحدة', amount: 420.50, date: 'اليوم', type: 'in' },
                  { desc: 'أرباح AdSense - ألمانيا', amount: 180.20, date: 'أمس', type: 'in' },
                  { desc: 'سحب إلى حساب بنكي', amount: -500.00, date: 'منذ 3 أيام', type: 'out' },
                ].map((t, i) => (
                  <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl shadow-inner border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${t.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {t.type === 'in' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-black text-sm">{t.desc}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{t.date}</p>
                      </div>
                    </div>
                    <p className={`font-black ${t.type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.amount > 0 ? '+' : ''}{ (t.amount * exchangeRates[currency]).toFixed(2) } {currency}
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl">
              <h3 className="text-xl font-black mb-4">أمان المدفوعات 🔐</h3>
              <p className="text-xs font-medium leading-relaxed opacity-90 mb-6">
                جميع التحويلات تتم عبر بروتوكول SSL المشفر ومرتبطة مباشرة بمعرف الناشر ca-pub-9209979470286545. يتم فحص الأرباح آلياً كل 6 ساعات.
              </p>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                 <p className="text-[9px] font-black uppercase opacity-60 mb-1">الرصيد المعلق</p>
                 <p className="text-lg font-black">$410.25</p>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
              <h4 className="font-black text-sm mb-4">وسائل السحب المدعومة</h4>
              <div className="grid grid-cols-2 gap-3">
                 {['Bank Transfer', 'Western Union', 'PayPal', 'Check'].map(w => (
                   <div key={w} className="bg-slate-50 p-3 rounded-xl text-[10px] font-black text-slate-500 text-center border border-slate-100 shadow-inner">{w}</div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;