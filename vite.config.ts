
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are served from the root path
  define: {
    // نضمن أن المتغير متاح في الكود المجمع النهائي
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // تم إزالة 'process.env': {} لتجنب مسح متغيرات البيئة الأخرى.
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});