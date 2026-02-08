
import React, { useState } from 'react';
import { Post } from '../types';
import PostCard from './PostCard';

interface HomeProps {
  posts: Post[];
  onPostClick: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ posts, onPostClick }) => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const featuredPost = posts[0];
  const categories = ['الكل', 'تقنية', 'تصميم', 'تسويق', 'ريادة أعمال'];

  const filteredPosts = activeCategory === 'الكل' 
    ? posts.slice(1) 
    : posts.slice(1).filter(p => p.category === activeCategory);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section 
        className="relative rounded-[3rem] overflow-hidden h-[600px] flex items-end group cursor-pointer shadow-3xl" 
        onClick={() => onPostClick(featuredPost.id)}
      >
        <img 
          src={featuredPost.image} 
          alt={featuredPost.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        <div className="relative p-10 md:p-20 w-full max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest">
              مقال مختار
            </span>
            <span className="text-white/60 text-xs font-medium uppercase tracking-widest">{featuredPost.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            {featuredPost.title}
          </h1>
          <p className="text-slate-200 text-xl mb-10 line-clamp-2 max-w-2xl leading-relaxed opacity-90">
            {featuredPost.excerpt}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5">
                <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-white uppercase">
                  {featuredPost.author[0]}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">{featuredPost.author}</span>
                <span className="text-white/50 text-xs uppercase tracking-tighter">{featuredPost.date}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <span className="text-white/80 text-sm font-bold uppercase tracking-widest">قراءة المقال الكامل ↗</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
              أحدث الرؤى الفكرية
              <div className="w-12 h-1.5 bg-blue-600 rounded-full" />
            </h2>
            <p className="text-slate-500 mt-2 font-medium">استكشف مواضيعنا المختارة بعناية لتحفيز نموك المعرفي.</p>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">لا توجد مقالات في هذا القسم حالياً.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
