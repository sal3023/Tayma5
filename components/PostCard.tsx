
import React from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const shareUrl = `https://eliteblog.pro/post/${post.id}`;
  const shareText = encodeURIComponent(post.title);

  const handleShare = (e: React.MouseEvent, platform: string) => {
    e.stopPropagation(); // Prevent card click
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div 
      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer group flex flex-col h-full hover-lift relative"
      onClick={onClick}
    >
      {/* Social Sharing Floating Bar - Only visible on hover */}
      <div className="absolute left-6 top-24 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
        {[
          { id: 'twitter', icon: '𝕏', color: 'bg-black' },
          { id: 'facebook', icon: 'f', color: 'bg-[#1877F2]' },
          { id: 'linkedin', icon: 'in', color: 'bg-[#0A66C2]' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={(e) => handleShare(e, btn.id)}
            className={`${btn.color} text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xl hover:scale-110 active:scale-90 transition-all`}
            title={`مشاركة على ${btn.id}`}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-6 right-6 z-10">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black text-blue-600 shadow-xl uppercase tracking-widest">
            {post.category}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 transform translate-y-4 group-hover:translate-y-0">
          <h4 className="text-white font-black text-lg leading-tight mb-2 line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] text-white font-bold">
              {post.author[0]}
            </div>
            <span className="text-white/80 text-xs font-bold">{post.author}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
           <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{post.readTime}</span>
           <span className="w-1.5 h-1.5 bg-blue-100 rounded-full"></span>
           <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{post.views.toLocaleString()} مشاهدة</span>
        </div>
        
        <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-tight">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed font-medium">
          {post.excerpt}
        </p>
        
        {/* Read More Button */}
        <div className="mb-8">
          <div 
            className="inline-flex items-center gap-3 bg-slate-50 text-slate-900 px-7 py-3 rounded-2xl text-xs font-black hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 group/btn"
          >
            اقرأ المقال الكامل
            <span className="text-lg transition-transform group-hover/btn:-translate-x-1">←</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-50 shadow-inner">
              {post.author[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 leading-none mb-1">{post.author}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{post.date}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <span className="text-xl">↖</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
