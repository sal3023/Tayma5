
import React, { useState } from 'react';
import { generateBusinessPlan } from '../services/gemini';

const BusinessPlanGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', industry: 'تقنية الناشئة', goals: '' });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateBusinessPlan(formData);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full min-h-[700px]">
          {/* Sidebar - Form */}
          <div className="lg:col-span-2 bg-slate-900 p-12 text-white">
            <h2 className="text-3xl font-black mb-4">مخطط الأعمال AI</h2>
            <p className="text-slate-400 mb-10 font-medium">حول فكرتك إلى واقع استراتيجي ملموس في ثوانٍ.</p>
            
            <form onSubmit={handleGenerate} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">اسم المشروع</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold"
                  placeholder="مثال: نيو-تيك سيستمز"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">الصناعة / القطاع</label>
                <select 
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold"
                >
                  <option className="bg-slate-900">تقنية الناشئة</option>
                  <option className="bg-slate-900">التجارة الإلكترونية</option>
                  <option className="bg-slate-900">الاستدامة والطاقة</option>
                  <option className="bg-slate-900">التعليم والتدريب</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">الأهداف والتحديات</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.goals}
                  onChange={e => setFormData({...formData, goals: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-sm leading-relaxed"
                  placeholder="ما الذي تحاول تحقيقه؟ من هو جمهورك؟"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:bg-slate-700"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>🪄 توليد المخطط الاستراتيجي</>
                )}
              </button>
            </form>
          </div>

          {/* Main View - Output */}
          <div className="lg:col-span-3 p-12 bg-slate-50/30 overflow-y-auto">
            {!plan && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl">📊</div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">بانتظار مدخلاتك</h3>
                  <p className="text-slate-500 font-medium">املأ البيانات على اليمين لبدء التحليل الذكي.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                </div>
                <p className="text-blue-600 font-black animate-pulse uppercase tracking-widest text-xs">Gemini AI is analyzing market data...</p>
              </div>
            )}

            {plan && (
              <div className="prose prose-slate max-w-none animate-in slide-in-from-bottom-10 duration-700">
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-200">
                  <h3 className="text-2xl font-black text-slate-900 m-0">خارطة الطريق لـ {formData.name}</h3>
                  <button 
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    PDF تحميل كـ
                  </button>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium text-lg">
                  {plan}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanGenerator;
