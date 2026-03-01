<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tayma5 - تطبيق الذكاء الاصطناعي المتقدم

تطبيق ويب حديث مبني بـ React و TypeScript يستخدم Gemini API لتقديم خدمات ذكية متقدمة.

## الميزات

- ✨ واجهة مستخدم حديثة وسهلة الاستخدام
- 🤖 دعم كامل لـ Gemini API
- 📱 تصميم متجاوب (Responsive Design)
- 🎨 تصميم احترافي باستخدام Tailwind CSS
- 📊 رسوم بيانية تفاعلية مع Recharts
- 🔍 معالجة Markdown متقدمة
- ⚡ أداء عالي مع Vite

## المتطلبات

- Node.js 18.x أو أحدث
- npm أو yarn
- مفتاح Gemini API

## التشغيل المحلي

**المتطلبات:** Node.js

1. تثبيت المتطلبات:
   ```bash
   npm install
   ```
2. عيّن `GEMINI_API_KEY` في [.env.local](.env.local) إلى مفتاح Gemini API الخاص بك
3. شغّل التطبيق:
   ```bash
   npm run dev
   ```

## النشر على Vercel

### الطريقة 1: استخدام Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### الطريقة 2: ربط مع GitHub

1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر على "New Project"
3. اختر المستودع من GitHub
4. أضف متغيرات البيئة:
   - `VITE_GEMINI_API_KEY`: مفتاح Gemini API
5. انقر على "Deploy"

## البناء للإنتاج

```bash
npm run build
```

## الأوامر المتاحة

```bash
npm run dev      # تشغيل الخادم المحلي
npm run build    # بناء للإنتاج
npm run preview  # معاينة الإنتاج محلياً
npm run lint     # فحص الأخطاء
```

عرض تطبيقك في AI Studio: https://ai.studio/apps/d3893e2f-ddcc-46aa-9052-b296cf1deccc
