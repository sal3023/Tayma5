
import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

const LegalPages: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const content = type === 'privacy' ? {
    title: 'سياسة الخصوصية (Privacy Policy)',
    desc: 'نحن نولي أهمية كبرى لخصوصية زوارنا. توضح هذه الوثيقة أنواع المعلومات الشخصية التي يتم استلامها وجمعها وكيفية استخدامها.',
    sections: [
      { t: 'ملفات تعريف الارتباط (Cookies)', d: 'نستخدم ملفات تعريف الارتباط لتخزين معلومات حول تفضيلات الزوار وتسجيل معلومات محددة عن المستخدم.' },
      { t: 'إعلانات جوجل أدسنس', d: 'تستخدم جوجل، كطرف ثالث، ملفات تعريف الارتباط لعرض الإعلانات على موقعنا بناءً على زيارات المستخدم.' },
      { t: 'تأمين البيانات', d: 'نحن نلتزم بحماية بياناتك الشخصية ولا نقوم ببيعها أو مشاركتها مع أي أطراف ثالثة دون إذنك.' }
    ]
  } : {
    title: 'شروط الاستخدام (Terms of Service)',
    desc: 'باستخدامك لهذه المدونة، فإنك توافق على الالتزام بالشروط والأحكام التالية.',
    sections: [
      { t: 'حقوق الملكية', d: 'جميع المحتويات المنشورة هي ملك لمدونة EliteBlog Pro ومحمية بموجب قوانين الملكية الفكرية.' },
      { t: 'الاستخدام المقبول', d: 'يُمنع استخدام الموقع في أي نشاط غير قانوني أو يهدف إلى الإضرار بالبنية التحتية للموقع.' },
      { t: 'إخلاء المسؤولية', d: 'المعلومات المقدمة هي لأغراض تعليمية وإخبارية فقط، ولا نتحمل مسؤولية أي قرارات تتخذ بناءً عليها.' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <button onClick={onBack} className="text-blue-600 font-black mb-10 flex items-center gap-2 hover:-translate-x-2 transition-transform">
        <span>→</span> العودة للرئيسية
      </button>
      
      <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-slate-100">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-slate-900">{content.title}</h1>
        <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">{content.desc}</p>
        
        <div className="space-y-12">
          {content.sections.map((s, i) => (
            <div key={i} className="border-r-4 border-blue-600 pr-8">
              <h3 className="text-2xl font-black mb-4 text-slate-800">{s.t}</h3>
              <p className="text-slate-600 leading-[1.8] font-medium">{s.d}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 pt-10 border-t border-slate-100 text-slate-400 text-xs font-bold text-center">
          تم التحديث الأخير في: {new Date().toLocaleDateString('ar-EG')}
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
