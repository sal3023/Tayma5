
import React from 'react';
import { Post } from '../types';

interface SitemapViewProps {
  posts: Post[];
  onBack: () => void;
}

const SitemapView: React.FC<SitemapViewProps> = ({ posts, onBack }) => {
  const generateSitemapXml = () => {
    const baseUrl = 'https://eliteblog.pro';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Add home
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // Add posts
    posts.forEach(post => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/post/${post.id}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    return xml;
  };

  const xmlContent = generateSitemapXml();

  return (
    <div className="max-w-4xl mx-auto py-10">
      <button 
        onClick={onBack}
        className="mb-8 text-blue-600 font-bold flex items-center gap-2"
      >
        <span>→</span> العودة
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black">خارطة الموقع (Sitemap.xml)</h1>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(xmlContent);
              alert('تم نسخ XML بنجاح!');
            }}
            className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            نسخ الكود
          </button>
        </div>
        
        <p className="text-slate-500 mb-6 text-sm">
          يتم توليد هذا الملف تلقائياً لمساعدة محركات البحث مثل Google على فهرسة محتوى مدونتك بشكل أسرع وأكثر دقة.
        </p>

        <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre">
          {xmlContent}
        </div>
      </div>
    </div>
  );
};

export default SitemapView;
