
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
}

export interface Analytics {
  labels: string[];
  data: number[];
}

export enum ViewMode {
  HOME = 'HOME',
  POST = 'POST',
  EDITOR = 'EDITOR',
  DASHBOARD = 'DASHBOARD',
  SITEMAP = 'SITEMAP',
  BUSINESS_PLAN = 'BUSINESS_PLAN'
}
