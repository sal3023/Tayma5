
import React, { useState, useEffect } from 'react';
import { ViewMode, Post } from './types';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PostDetail from './components/PostDetail';
import BlogEditor from './components/BlogEditor';
import Dashboard from './components/Dashboard';
import SitemapView from './components/SitemapView';
import BusinessPlanGenerator from './components/BusinessPlanGenerator';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'مستقبل الذكاء الاصطناعي في 2025',
    excerpt: 'استكشاف شامل للتحولات الجذرية التي سيشهدها العالم مع تطور نماذج اللغة الكبيرة والتطبيقات العملية.',
    content: 'يعتبر عام 2025 نقطة تحول حقيقية في تاريخ التقنية، حيث لم يعد الذكاء الاصطناعي مجرد أداة مساعدة، بل أصبح شريكاً استراتيجياً في اتخاذ القرار وإدارة المؤسسات. نرى اليوم كيف تندمج الحوسبة الكمومية مع النماذج التوليدية لخلق آفاق جديدة من الإبداع والابتكار...',
    author: 'أحمد محمود',
    date: '24 أكتوبر 2024',
    category: 'تقنية',
    image: 'https://picsum.photos/seed/tech/800/400',
    readTime: '5 دقائق',
    views: 1250,
    seoTitle: 'دليل الذكاء الاصطناعي 2025: ما الذي ينتظرنا؟',
    seoDescription: 'تعرف على أهم التوقعات والتحولات في عالم الذكاء الاصطناعي لعام 2025 وكيف ستؤثر على حياتنا اليومية وأعمالنا.'
  },
  {
    id: '2',
    title: 'كيف تبني هوية بصرية عالمية لمدونتك',
    excerpt: 'دليل عملي لاختيار الألوان والخطوط التي تعكس احترافية محتواك وتجذب الجمهور المستهدف.',
    content: 'الهوية البصرية ليست مجرد شعار جميل، بل هي لغة صامتة تتحدث مع القارئ قبل أن يقرأ كلمة واحدة من محتواك. في هذا المقال، سنتعرف على سيكولوجية الألوان وأهمية التباين في تصميم واجهات المستخدم الاحترافية...',
    author: 'سارة خالد',
    date: '20 أكتوبر 2024',
    category: 'تصميم',
    image: 'https://picsum.photos/seed/design/800/400',
    readTime: '8 دقائق',
    views: 890
  },
  {
    id: '3',
    title: 'استراتيجيات تحسين محركات البحث SEO',
    excerpt: 'تجاوز الأساسيات وتعلم كيف تتصدر النتائج الأولى باستخدام تقنيات السيو الحديثة والبحث الدقيق عن الكلمات.',
    content: 'قواعد السيو تتغير باستمرار، وما كان يعمل العام الماضي قد لا يعمل اليوم. نركز في هذا الدليل على تجربة المستخدم (UX) كعامل أساسي للترتيب، بالإضافة إلى تحسين الروابط الداخلية وبناء السلطة الرقمية...',
    author: 'محمد علي',
    date: '15 أكتوبر 2024',
    category: 'تسويق',
    image: 'https://picsum.photos/seed/seo/800/400',
    readTime: '12 دقيقة',
    views: 3420
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handlePostClick = (id: string) => {
    setSelectedPostId(id);
    setView(ViewMode.POST);
  };

  const handleSavePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setView(ViewMode.HOME);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar currentView={view} setView={setView} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === ViewMode.HOME && <Home posts={posts} onPostClick={handlePostClick} />}
        {view === ViewMode.POST && selectedPost && <PostDetail post={selectedPost} onBack={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.EDITOR && <BlogEditor onSave={handleSavePost} onCancel={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.DASHBOARD && <Dashboard posts={posts} onUpdatePost={handleUpdatePost} />}
        {view === ViewMode.SITEMAP && <SitemapView posts={posts} onBack={() => setView(ViewMode.HOME)} />}
        {view === ViewMode.BUSINESS_PLAN && <BusinessPlanGenerator />}
      </main>

      <footer className="border-t bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-blue-600 mb-2">EliteBlog Pro</h2>
            <p className="text-sm">مدونة احترافية بمعايير عالمية.</p>
          </div>
          <div className="flex space-x-reverse space-x-6">
            <a href="#" className="hover:text-blue-600 transition">تويتر</a>
            <a href="#" className="hover:text-blue-600 transition">لينكد إن</a>
            <button 
              onClick={() => setView(ViewMode.SITEMAP)}
              className="hover:text-blue-600 transition text-sm"
            >
              خارطة الموقع (Sitemap)
            </button>
            <a href="#" className="hover:text-blue-600 transition">اتصل بنا</a>
          </div>
          <div className="mt-4 md:mt-0 text-sm">
            © 2024 جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
