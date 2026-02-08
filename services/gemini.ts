
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePostSummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك محررًا محترفًا، قدم ملخصًا جذابًا ومختصرًا (لا يزيد عن 3 جمل) للمقال التالي باللغة العربية: ${content}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "تعذر إنشاء ملخص تلقائي حاليًا.";
  }
};

export const suggestSEO = async (title: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير سيو (SEO) عالمي، قم بتحليل المقال واقترح تحسينات جذابة.
      العنوان الحالي: ${title}
      المحتوى: ${content.substring(0, 1000)}
      
      المتطلبات:
      1. العودة بـ SEO Title جذاب يزيد النقر.
      2. العودة بـ Meta Description احترافي.
      3. ذكر "السبب" (Reasoning) وراء هذه الاختيارات بلهجة خبيرة.`,
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("SEO Suggestion Error:", error);
    return null;
  }
};

export const generateBusinessPlan = async (details: { name: string, industry: string, goals: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `قم بتوليد خطة عمل (Business Plan) احترافية وعالمية للمشروع التالي باللغة العربية:
      اسم المشروع: ${details.name}
      القطاع: ${details.industry}
      الأهداف الأساسية: ${details.goals}
      
      يجب أن تتضمن الخطة الأقسام التالية بأسلوب استراتيجي:
      1. ملخص تنفيذي (Executive Summary)
      2. تحليل السوق والمنافسين
      3. خطة العمليات والنمو
      4. التوقعات المالية المبدئية`,
    });
    return response.text;
  } catch (error) {
    console.error("Business Plan Error:", error);
    return "فشل توليد الخطة، يرجى المحاولة لاحقاً.";
  }
};

export const generateImageForPost = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: `Professional, modern, high-quality blog header image for: ${prompt}. Artistic, clean, minimal style.` }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });
    
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const textToSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `اقرأ هذا المقال بصوت رزين واحترافي: ${text.substring(0, 1000)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
