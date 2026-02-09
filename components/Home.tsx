
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
    <div className="space-y-16 pb-20">
      {/* Hero Section Optimized */}
      <section 
        className="relative rounded-[2.5rem] overflow-hidden min-h-[500px] md:h-[600px] flex items-end group cursor-pointer shadow-2xl bg-slate-900" 
        onClick={() => onPostClick(featuredPost.id)}
      >
        <img 
          src={featuredPost.image} 
          alt={featuredPost.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="relative p-8 md:p-16 w-full max-w-4xl z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
              مقال مختار
            </span>
            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{featuredPost.category}</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
            {featuredPost.title}
          </h1>
          <p className="text-slate-200 text-lg md:text-xl mb-8 line-clamp-2 max-w-2xl leading-relaxed opacity-90 font-medium">
            {featuredPost.excerpt}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center font-black text-white bg-white/10">
                {featuredPost.author[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-sm">{featuredPost.author}</span>
                <span className="text-white/50 text-[10px] uppercase font-bold">{featuredPost.date}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <span className="text-white/80 text-xs font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors">اقرأ المزيد ↗</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-right">
            <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-4">
              أحدث المقالات
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
            </h2>
            <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-wide">اكتشف المحتوى العالمي المربح</p>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100 shadow-inner">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-400 font-black text-sm uppercase tracking-widest">لا توجد مقالات في هذا القسم حالياً</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
