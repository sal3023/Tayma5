
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * محرك أتلانتس الاستراتيجي - توليد محتوى عالي الربحية
 */
export const generateFullArticle = async (title: string, category: string, market: string = 'Global') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `بصفتك خبير سيو عالمي ومتخصص في الربح من الإعلانات (AdSense Specialist)، اكتب مقالاً مرجعياً ضخماً باللغة العربية يستهدف السوق "${market}".
          الموضوع: "${title}" في قسم "${category}".

          المعايير الاستراتيجية للربح والأرشفة:
          1. الاستهداف الجغرافي: إذا كان السوق (USA/Europe)، ادمج مفاهيم وإحصائيات دولية حديثة تجذب معلنين ذوي ميزانيات ضخمة.
          2. هندسة الكلمات: استخدم كلمات مفتاحية ذات CPC مرتفع (High Cost Per Click).
          3. الطول والعمق: المقال يجب أن يتجاوز 1200 كلمة، مقسم لعناوين H2 و H3 احترافية.
          4. العناصر التفاعلية: أضف جداول مقارنة، قوائم نصائح، وقسم أسئلة وأجوبة (FAQ) لتعزيز الـ Rich Snippets.
          5. اللكنة: لغة عربية فصيحة، رصينة، وعالمية المنهج.
          
          التنسيق: Markdown كامل.`
        }]
      }],
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      content: response.text || "",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Atlantis Pro Error:", error);
    throw new Error("فشل محرك التوليد في الوصول للبيانات العالمية.");
  }
};

/**
 * تحليل حالة المدونة واقتراح النواقص (المساعد الذكي)
 */
export const analyzeBlogGaps = async (posts: any[]) => {
  const postTitles = posts.map(p => p.title).join(", ");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `بصفتك المساعد الذكي الالي لمدونة EliteBlog، حلل هذه القائمة من المقالات الحالية: [${postTitles}].
          أجب باللغة العربية:
          1. ما هي المواضيع التقنية أو الربحية الناقصة حالياً لتكتمل المدونة؟
          2. اقترح 3 أفكار مقالات "نيش" (Niche) عالية الربحية لم يتم التطرق لها.
          3. نصيحة تقنية لتحسين الأداء أو السيو.
          كن مختصراً ومباشراً وعملياً.`
        }]
      }]
    });
    return response.text;
  } catch (error) {
    return "عذراً، المحلل الذكي غير متاح حالياً.";
  }
};

/**
 * رادار الترندات المربحة عالمياً
 */
export const fetchGlobalTrends = async (category: string, region: string = 'Global') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `حلل بيانات البحث الحالية في منطقة "${region}" لقطاع "${category}". استخرج أفضل 5 مواضيع ترند ذات عائد إعلاني مرتفع.` }] }],
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
  } catch (error) {
    return [];
  }
};

export const generateImageForPost = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        parts: [{
          text: `High-end commercial photography for a global tech blog. Subject: ${prompt}. Professional lighting, 8k resolution, minimalist, corporate aesthetic, suitable for USA/Europe markets.`
        }]
      }],
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (error) {
    return null;
  }
};

export const generatePostSummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `لخص هذا المحتوى العميق في فقرة مركزة للسيو: ${content.substring(0, 3000)}` }] }]
    });
    return response.text;
  } catch (error) {
    return "";
  }
};

export const suggestSEO = async (title: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `اقترح تحسينات سيو للمقال: ${title}` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoTitle: { type: Type.STRING },
            seoDescription: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["seoTitle", "seoDescription", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return null;
  }
};

/**
 * تحويل النص إلى كلام باستخدام نموذج Gemini TTS
 */
export const textToSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.substring(0, 1500) }] }],
      config: {
        // Use Modality.AUDIO from @google/genai as required by guidelines
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    return null;
  }
};

export const translateArticle = async (content: string, targetLang: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Translate to ${targetLang}: ${content.substring(0, 4000)}` }] }]
    });
    return response.text;
  } catch (error) {
    return null;
  }
};

export const generateBusinessPlan = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Create a professional business plan for ${data.name}` }] }]
    });
    return response.text;
  } catch (error) {
    return "";
  }
};
