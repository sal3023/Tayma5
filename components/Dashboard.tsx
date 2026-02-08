
import React, { useState } from 'react';
import { Post } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { suggestSEO } from '../services/gemini';

interface DashboardProps {
  posts: Post[];
  onUpdatePost: (post: Post) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, onUpdatePost }) => {
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [suggestionResult, setSuggestionResult] = useState<{id: string, reasoning: string} | null>(null);

  const handleOptimize = async (post: Post) => {
    setOptimizingId(post.id);
    const suggestion = await suggestSEO(post.title, post.content);
    if (suggestion) {
      onUpdatePost({
        ...post,
        seoTitle: suggestion.seoTitle,
        seoDescription: suggestion.seoDescription
      });
      setSuggestionResult({ id: post.id, reasoning: suggestion.reasoning });
    }
    setOptimizingId(null);
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    // Simple notification can be replaced with a toast in a larger app
    alert(msg);
  };

  const chartData = posts.map(p => ({
    name: p.title.slice(0, 10) + '...',
    views: p.views,
  }));

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-gradient mb-2">الرؤى والبيانات</h1>
          <p className="text-slate-500 font-medium">تحليل ذكي لأداء المحتوى الخاص بك وتأثيره الرقمي.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all">تصدير التقرير</button>
           <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-white animate-ping" />
             تحديث مباشر
           </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'إجمالي المحتوى', val: posts.length, color: 'blue', desc: 'مقال منشور' },
          { label: 'التفاعل الكلي', val: posts.reduce((a, b) => a + b.views, 0).toLocaleString(), color: 'emerald', desc: 'مشاهدة فريدة' },
          { label: 'جودة السيو', val: `${Math.round((posts.filter(p => p.seoTitle).length / posts.length) * 100)}%`, color: 'amber', desc: 'تغطية Meta' },
          { label: 'متوسط القراءة', val: '6.4 د', color: 'indigo', desc: 'لكل مستخدم' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-2 h-full bg-blue-600/10 group-hover:bg-blue-600 transition-colors`} />
            <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">{s.label}</p>
            <p className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{s.val}</p>
            <p className="text-xs text-slate-500 font-medium">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Charts Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
              توزيع المشاهدات
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                  />
                  <Bar dataKey="views" radius={[12, 12, 12, 12]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#6366f1'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Audit Table */}
          <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-4">
                  تدقيق المحتوى الذكي
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase font-black tracking-tighter">AI Engine v2</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">تحسين مستمر لظهورك في نتائج البحث.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {posts.map(post => (
                <div key={post.id} className="p-8 rounded-[2.5rem] border border-slate-50 hover:border-slate-100 hover:shadow-lg hover:shadow-slate-100 transition-all duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-2 h-2 rounded-full ${post.seoTitle ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <h3 className="font-black text-xl text-slate-800">{post.title}</h3>
                      </div>
                      <p className="text-sm text-slate-400 font-medium mb-6">القسم: {post.category} • التفاعل: {post.views.toLocaleString()} مشاهدة</p>

                      {/* SEO AI Results Display */}
                      {(post.seoTitle || post.seoDescription) && (
                        <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-6 animate-in fade-in slide-in-from-right-4 duration-500">
                          {post.seoTitle && (
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">SEO Title المولد</span>
                                <p className="text-sm font-bold text-slate-700 leading-tight">{post.seoTitle}</p>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(post.seoTitle!, 'تم نسخ عنوان SEO!')}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
                                title="نسخ العنوان"
                              >
                                <span className="text-sm">📋</span>
                              </button>
                            </div>
                          )}
                          
                          {post.seoDescription && (
                            <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-200/60">
                              <div className="flex-1">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Meta Description المولد</span>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">{post.seoDescription}</p>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(post.seoDescription!, 'تم نسخ وصف الميتا!')}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
                                title="نسخ الوصف"
                              >
                                <span className="text-sm">📋</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handleOptimize(post)}
                      disabled={optimizingId === post.id}
                      className={`whitespace-nowrap px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl ${
                        optimizingId === post.id 
                          ? 'bg-slate-100 text-slate-400 animate-pulse border border-slate-200' 
                          : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200 hover:shadow-blue-500/20 active:scale-95'
                      }`}
                    >
                      {optimizingId === post.id ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          يتم التحليل...
                        </span>
                      ) : '✨ تحسين بواسطة AI'}
                    </button>
                  </div>

                  {suggestionResult?.id === post.id && (
                    <div className="mt-2 p-6 bg-blue-600/5 rounded-2xl border border-blue-600/10 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                           <span className="text-lg">💡</span>
                         </div>
                         <div>
                           <p className="text-blue-900 text-xs font-black uppercase tracking-widest mb-2">توصية خبير الـ SEO الاستراتيجية:</p>
                           <p className="text-blue-800 text-sm leading-relaxed font-bold italic">"{suggestionResult.reasoning}"</p>
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-10">
                    {[
                      { label: 'العنوان المخصص', active: !!post.seoTitle },
                      { label: 'وصف الميتا', active: !!post.seoDescription },
                      { label: 'تحليل الروابط', active: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 space-y-2">
                         <div className={`h-1.5 rounded-full transition-all duration-1000 ${item.active ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-100'}`} />
                         <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block text-center md:text-right">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Trend Chart */}
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden h-full min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
            <h2 className="text-2xl font-black mb-10 relative z-10 tracking-tight">مسار النمو</h2>
            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { m: 'يوليو', v: 400 }, { m: 'أغسطس', v: 900 }, { m: 'سبتمبر', v: 1200 }, { m: 'أكتوبر', v: 2800 }
                ]}>
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '15px', color: '#fff' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorV)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-10 space-y-6 relative z-10">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">المقال الأعلى تأثيراً</p>
                <p className="font-bold text-lg">{posts[0]?.title || 'جاري التحميل...'}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">نسبة النمو هذا الشهر</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full font-black text-sm">+42.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
