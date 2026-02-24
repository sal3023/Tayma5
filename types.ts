
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  originalLanguage?: string;
  targetMarket?: 'Global' | 'USA' | 'Europe' | 'MENA';
  profitScore?: number; // 1-100
}

export interface TrendIdea {
  topic: string;
  reason: string;
  profitPotential: 'High' | 'Medium' | 'Emerging';
  keywords: string[];
  region?: string;
  estimatedCPC?: string;
}

export enum ViewMode {
  HOME = 'HOME',
  POST = 'POST',
  EDITOR = 'EDITOR',
  DASHBOARD = 'DASHBOARD',
  SITEMAP = 'SITEMAP',
  BUSINESS_PLAN = 'BUSINESS_PLAN',
  TRENDS = 'TRENDS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  WALLET = 'WALLET',
  EXTERNAL_BLOG_ANALYSER = 'EXTERNAL_BLOG_ANALYSER', // إضافة وضع العرض الجديد
  ASSISTANT = 'ASSISTANT' // وضع عرض للمساعد الذكي
}