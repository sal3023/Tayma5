
import React from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer group flex flex-col h-full relative"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute top-6 right-6 z-10">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black text-blue-600 shadow-xl uppercase tracking-widest">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
           <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{post.readTime}</span>
           <span className="w-1.5 h-1.5 bg-blue-100 rounded-full"></span>
           <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-black">Score: {post.profitScore}%</span>
        </div>
        
        <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-tight">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed font-medium">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-xs">
              {post.author[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 leading-none mb-1">{post.author}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{post.date}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <span className="text-xl">↖</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
