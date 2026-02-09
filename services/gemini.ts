
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Post } from "../types";

// Initialize the Google GenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * محرك أتلانتس الاستراتيجي 2.0 - هندسة المحتوى عالي الربحية
 */
export const generateFullArticle = async (title: string, category: string, market: string = 'Global') => {
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
    
    // Extract grounding chunks and append URLs to the content as required by search grounding rules
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

    return {
      content: content,
      grounding: groundingChunks || []
    };
  } catch (error) {
    console.error("Atlantis Pro Error:", error);
    throw new Error("فشل محرك التوليد في الوصول للبيانات العالمية.");
  }
};

/**
 * رادار الترندات المربحة عالمياً 2.0
 */
export const fetchGlobalTrends = async (category: string, region: string = 'Global') => {
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
    // Use .text property to get the generated string
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

/**
 * توليد ملخص تنفيذي ذكي للمقال
 */
export const generatePostSummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `قم بتلخيص المقال التالي في شكل نقاط مركزة تبرز الجوهر المالي والتقني: \n\n ${content.substring(0, 5000)}` }] }],
    });
    return response.text || null;
  } catch (error) {
    console.error("Summary Error:", error);
    return null;
  }
};

/**
 * ترجمة المقالات للأسواق العالمية المستهدفة
 */
export const translateArticle = async (content: string, targetLang: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Translate the following article to ${targetLang}. Keep the markdown structure: \n\n ${content}` }] }],
    });
    return response.text || null;
  } catch (error) {
    console.error("Translation Error:", error);
    return null;
  }
};

/**
 * مولد خطط الأعمال الاستراتيجية AI
 */
export const generateBusinessPlan = async (formData: { name: string, industry: string, goals: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `قم بإنشاء خطة عمل شاملة لـ "${formData.name}" في قطاع "${formData.industry}". الأهداف: ${formData.goals}. ركز على الأرباح والنمو العالمي.` }] }],
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text || "فشل في توليد الخطة.";
  } catch (error) {
    console.error("Business Plan Error:", error);
    return "فشل في الوصول للمحرك الاستراتيجي.";
  }
};

/**
 * تحليل فجوات المحتوى وفرص الربح (Gap Analysis)
 */
export const analyzeBlogGaps = async (posts: Post[]) => {
  try {
    const titles = posts.map(p => p.title).join(", ");
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `بناءً على العناوين الحالية (${titles})، ما هي الفجوات في المحتوى التي يمكن استغلالها لزيادة الربح (High CPC)؟` }] }],
    });
    return response.text || "تعذر التحليل حالياً.";
  } catch (error) {
    console.error("Gap Analysis Error:", error);
    return "فشل المحرك في تحليل البيانات.";
  }
};

/**
 * توليد صور غلاف احترافية باستخدام نموذج الصور المتقدم
 */
export const generateImageForPost = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{
        parts: [{
          text: `Professional editorial illustration for a high-end business blog. Theme: ${prompt}. Photorealistic, cinematic lighting, corporate blue and slate gray palette, 4k resolution, wide aspect ratio.`
        }]
      }],
      config: {
        imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
      }
    });
    // Iterate through all parts to find the image data as per guidelines
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * تحويل النص إلى كلام (Text-to-Speech)
 */
export const textToSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.substring(0, 1500) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    return null;
  }
};
