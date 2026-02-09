
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Post } from "../types";

// استدعاء المفتاح بشكل آمن من البيئة المحددة في Vercel
const getApiKey = () => process.env.API_KEY || "";

/**
 * محرك أتلانتس الاستراتيجي 2.0 - هندسة المحتوى عالي الربحية
 */
export const generateFullArticle = async (title: string, category: string, market: string = 'Global') => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key is missing. Please set it in Vercel.");
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        parts: [{
          text: `بصفتك خبير استراتيجيات محتوى دولي (International Content Strategist)، قم ببناء مقال مرجعي فائق الجودة للسوق "${market}".
          الموضوع: "${title}"
          القسم: "${category}"

          الهيكل المطلوب للربح الأقصى:
          1. العنوان: جذاب، يثير الفضول، ويحتوي على الكلمة المفتاحية الرئيسية.
          2. المقدمة: تستخدم أسلوب (Hook) عالمي لجذب القارئ في أول 3 ثوانٍ.
          3. المحتوى: مقسم لـ (H2, H3) مع دمج كلمات مفتاحية LSI (Latent Semantic Indexing) لرفع الأرشفة.
          4. التحليل المالي: إذا كان الموضوع تقنياً أو مالياً، أضف فقرة "توقعات السوق 2025".
          5. الخاتمة: دعوة لاتخاذ إجراء (CTA) ذكية لزيادة التفاعل الإعلاني.
          
          التنسيق: Markdown احترافي مع جداول بيانات إذا لزم الأمر.`
        }]
      }],
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    let content = response.text || "";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      content += "\n\n### المصادر والمراجع (References)\n";
      const seenUrls = new Set();
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && !seenUrls.has(chunk.web.uri)) {
          content += `- [${chunk.web.title || chunk.web.uri}](${chunk.web.uri})\n`;
          seenUrls.add(chunk.web.uri);
        }
      });
    }

    return { content, grounding: groundingChunks || [] };
  } catch (error) {
    console.error("Atlantis Pro Error:", error);
    throw new Error("فشل محرك التوليد في الوصول للبيانات العالمية.");
  }
};

export const fetchGlobalTrends = async (category: string, region: string = 'Global') => {
  const apiKey = getApiKey();
  if (!apiKey) return [];
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `قم بإجراء مسح فوري لترندات البحث في "${region}" لقطاع "${category}". استخرج 6 مواضيع "Gold Mine" ذات CPC يتجاوز $10.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              reason: { type: Type.STRING },
              profitPotential: { type: Type.STRING, enum: ["High", "Medium", "Emerging"] },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              region: { type: Type.STRING },
              estimatedCPC: { type: Type.STRING }
            },
            required: ["topic", "reason", "profitPotential", "keywords", "region", "estimatedCPC"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generatePostSummary = async (content: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `قم بتلخيص المقال التالي: \n\n ${content.substring(0, 5000)}` }] }],
    });
    return response.text || null;
  } catch (error) { return null; }
};

export const translateArticle = async (content: string, targetLang: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Translate to ${targetLang}: \n\n ${content}` }] }],
    });
    return response.text || null;
  } catch (error) { return null; }
};

export const generateBusinessPlan = async (formData: { name: string, industry: string, goals: string }) => {
  const apiKey = getApiKey();
  if (!apiKey) return "API Key missing";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `إنشاء خطة عمل لـ ${formData.name} في قطاع ${formData.industry}.` }] }],
    });
    return response.text || "فشل التوليد.";
  } catch (error) { return "خطأ في الاتصال."; }
};

export const analyzeBlogGaps = async (posts: Post[]) => {
  const apiKey = getApiKey();
  if (!apiKey) return "API Key missing";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `حلل فجوات المحتوى لهذه العناوين: ${posts.map(p => p.title).join(", ")}` }] }],
    });
    return response.text || "تعذر التحليل.";
  } catch (error) { return "خطأ فني."; }
};

export const generateImageForPost = async (prompt: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { return null; }
};

export const textToSpeech = async (text: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.substring(0, 1000) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) { return null; }
};
