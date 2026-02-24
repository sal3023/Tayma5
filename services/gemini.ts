
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Post } from "../types";

// استدعاء المفتاح بشكل آمن من البيئة المحددة في Vercel
const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    // رمي خطأ واضح ومحدد إذا كان مفتاح API مفقوداً
    throw new Error("API Key is missing or invalid. Please ensure 'API_KEY' is set correctly in your environment variables (e.g., Vercel).");
  }
  return apiKey;
};

/**
 * محرك أتلانتس الاستراتيجي 2.0 - هندسة المحتوى عالي الربحية
 */
export const generateFullArticle = async (title: string, category: string, market: string = 'Global') => {
  const apiKey = getApiKey(); // ستتولى getApiKey رمي الخطأ إذا كان المفتاح مفقوداً
  
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
  } catch (error) { 
    console.error("Fetch Global Trends Error:", error);
    // يمكنك هنا اختيار إعادة رمي الخطأ أو إرجاع مصفوفة فارغة بناءً على تفضيلك
    // For now, return empty array as original behavior
    return []; 
  }
};

export const generatePostSummary = async (content: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `قم بتلخيص المقال التالي: \n\n ${content.substring(0, 5000)}` }] }],
    });
    return response.text || null;
  } catch (error) { 
    console.error("Generate Post Summary Error:", error);
    return null; 
  }
};

export const translateArticle = async (content: string, targetLang: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Translate to ${targetLang}: \n\n ${content}` }] }],
    });
    return response.text || null;
  } catch (error) { 
    console.error("Translate Article Error:", error);
    return null; 
  }
};

export const generateBusinessPlan = async (formData: { name: string, industry: string, goals: string }) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `إنشاء خطة عمل لـ ${formData.name} في قطاع ${formData.industry}.` }] }],
    });
    return response.text || "فشل التوليد.";
  } catch (error) { 
    console.error("Generate Business Plan Error:", error);
    return "خطأ في الاتصال."; 
  }
};

// تحليل فجوات المحتوى - أكثر تركيزًا على المواضيع المفقودة
export const analyzeBlogGaps = async (posts: Post[]): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  if (posts.length === 0) {
    return "لا توجد مقالات حالياً في مدونتك لتحليل فجوات المحتوى. يرجى إضافة بعض المقالات أولاً.";
  }

  const existingTopics = posts.map(p => `- ${p.title} (القسم: ${p.category})`).join("\n");
  
  try {
    const prompt = `بصفتك خبير استراتيجيات محتوى متقدم، قم بتحليل المواضيع التالية التي تغطيها المدونة:
\`\`\`
${existingTopics}
\`\`\`
بناءً على هذه المواضيع، ما هي "فجوات المحتوى" الرئيسية التي لم يتم تغطيتها بعد والتي يمكن استهدافها لجذب جمهور جديد وزيادة الأرباح؟
قدم 5-7 اقتراحات لمواضيع جديدة ذات صلة وعالية الطلب، مع ذكر سبب أهميتها وكلمات مفتاحية محتملة.
قدم الإجابة بتنسيق Markdown احترافي.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1500 }
      },
    });
    return response.text || "تعذر تحليل فجوات المحتوى.";
  } catch (error) {
    console.error("Content Gaps Analysis Error:", error);
    throw new Error("فشل محرك أتلانتس في تحليل فجوات المحتوى.");
  }
};

// وظيفة جديدة وشاملة لتحليل المدونات (الخارجية والداخلية) مع دعم تحليل SEO المحلي
export const analyzeBlog = async (
  options: {
    blogSitemapUrl?: string; // لرابط خريطة موقع المدونات الخارجية
    internalPostsData?: { id: string; title: string; excerpt: string; content: string; category: string; }[]; // لبيانات المقالات الداخلية
    latLng?: { latitude: number; longitude: number; }; // للموقع الجغرافي لتحليل SEO المحلي
  }
) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const tools: any[] = [{ googleSearch: {} }]; // Google Search مفيدة دائمًا للgrounding الخارجي
  let promptText = `بصفتك خبير SEO واستراتيجيات محتوى متقدم، قم بتحليل هذه المدونة للحصول على رؤى عميقة.`;

  if (options.blogSitemapUrl) {
    promptText += ` استخدم أدوات البحث المتاحة للوصول إلى محتوى المدونة من خلال رابط خريطة الموقع (Sitemap URL).`;
    promptText += ` رابط خريطة الموقع للمدونة: ${options.blogSitemapUrl}`;
  } else if (options.internalPostsData && options.internalPostsData.length > 0) {
    // تجميع بيانات المقالات الداخلية بطريقة موجزة ومفيدة للنموذج
    const summarizedInternalContent = options.internalPostsData.map(post => ({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      // يمكن تقليم المحتوى الكامل إذا كان طويلاً جداً لضمان عدم تجاوز حدود التوكن
      contentSnippet: post.content.substring(0, 500) // جزء من المحتوى لتوفير السياق
    }));
    promptText += ` المحتوى التالي يمثل خلاصة مقالات المدونة المراد تحليلها (عناوين، فئات، مقتطفات، ومقتطفات من المحتوى):
    \`\`\`json
    ${JSON.stringify(summarizedInternalContent, null, 2)}
    \`\`\`
    قم بتحليل هذا المحتوى مباشرةً، مع الأخذ في الاعتبار أن هذا هو المحتوى الداخلي للمدونة.`;
  } else {
    throw new Error("يجب توفير إما رابط خريطة الموقع أو بيانات المقالات الداخلية للتحليل.");
  }

  if (options.latLng) {
    tools.unshift({ googleMaps: {} }); // إضافة Google Maps tool في البداية
    promptText += ` بالإضافة إلى ذلك، استخدم Google Maps grounding لتحديد فرص تحسين SEO المحلية بناءً على الموقع المحدد: Latitude ${options.latLng.latitude}, Longitude ${options.latLng.longitude}.`;
  }

  promptText += ` قدم تقريراً مفصلاً عن:
          - **فجوات المحتوى (Content Gaps):** ما هي المواضيع التي لم تغطها المدونة بعد والتي يبحث عنها الجمهور المستهدف (مع التركيز على الفرص المحلية إن أمكن)؟
          - **فرص تحسين SEO:** اقتراحات لتحسين العناوين، الأوصاف، الكلمات المفتاحية، وهيكل الروابط الداخلية (مع اقتراحات للكلمات المفتاحية المحلية).
          - **الكلمات المفتاحية عالية الربح:** اقترح كلمات مفتاحية ذات قيمة CPC عالية يمكن استهدافها (مع الأخذ في الاعتبار الكلمات المفتاحية المحلية).
          - **مواءمة الترندات:** كيف يمكن للمدونة أن تتوافق مع الترندات العالمية والمحلية الحالية والمستقبلية لزيادة الزيارات والأرباح؟
          - **تصنيف الجودة الإجمالية:** تقييم عام لجودة المحتوى وسلطة المدونة (Domain Authority) وجودة الأرشفة والسرعة ومدى توافقها مع سياسات Google.
          
          قدم التحليل بتنسيق Markdown احترافي مع نقاط واضحة وعناوين فرعية.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // استخدام نموذج قوي للتحليل المعقد
      contents: [{
        parts: [{ text: promptText }]
      }],
      config: {
        tools: tools, // استخدام Tools بشكل شرطي
        thinkingConfig: { thinkingBudget: 2000 }, // ميزانية تفكير أكبر لتحليل أعمق
        toolConfig: {
          retrievalConfig: options.latLng ? { latLng: options.latLng } : undefined // تمرير الموقع لـ Google Maps
        }
      },
    });

    let resultText = response.text || "";

    // استخلاص المصادر والمراجع إذا وجدت (من Google Search و Google Maps)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      resultText += "\n\n### المصادر والمراجع (Grounding References)\n";
      const seenUrls = new Set();
      groundingChunks.forEach((chunk: any) => {
        let uriToAdd: string | undefined;
        let titleToAdd: string | undefined;

        if (chunk.web?.uri) {
          uriToAdd = chunk.web.uri;
          titleToAdd = chunk.web.title || chunk.web.uri;
        } else if (chunk.maps?.uri) {
          uriToAdd = chunk.maps.uri;
          titleToAdd = chunk.maps.title || chunk.maps.uri;
        }

        if (uriToAdd && !seenUrls.has(uriToAdd)) {
          resultText += `- [${titleToAdd}](${uriToAdd})\n`;
          // إضافة reviewSnippets إذا كانت متاحة من خرائط جوجل
          if (chunk.maps?.placeAnswerSources?.reviewSnippets && chunk.maps.placeAnswerSources.reviewSnippets.length > 0) {
             chunk.maps.placeAnswerSources.reviewSnippets.forEach((snippet: any) => {
                if (snippet.uri && !seenUrls.has(snippet.uri)) {
                   resultText += `  - [تقييم: ${snippet.text.substring(0, 50)}...](${snippet.uri})\n`;
                   seenUrls.add(snippet.uri);
                }
             });
          }
          seenUrls.add(uriToAdd);
        }
      });
    }

    return resultText;
  } catch (error) {
    console.error("Blog Analysis Error:", error);
    throw new Error("فشل محرك أتلانتس في تحليل المدونة. يرجى التأكد من صحة الرابط أو توفر البيانات.");
  }
};


export const generateImageForPost = async (prompt: string) => {
  const apiKey = getApiKey();
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
  } catch (error) { 
    console.error("Generate Image For Post Error:", error);
    return null; 
  }
};

export const textToSpeech = async (text: string) => {
  const apiKey = getApiKey();
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
  } catch (error) { 
    console.error("Text To Speech Error:", error);
    return null; 
  }
};

// وظيفة جديدة لتحليل سرعة المدونة وتقديم اقتراحات التحسين
export const getBlogSpeedOptimizationSuggestions = async (blogUrl: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const promptText = `بصفتك خبيرًا متقدمًا في تحسين سرعة مدونات Blogger وتجربة المستخدم، قم بتحليل مدونة Blogger هذه: ${blogUrl}.
          قدم تقريرًا مفصلًا بتنسيق Markdown يغطي ما يلي:
          - **تقييم عام للسرعة:** تقييم تقديري للسرعة الحالية (سريع، متوسط، بطيء جدًا) مع أسباب محتملة.
          - **أبرز مشاكل الأداء:** حدد 3-5 مشاكل رئيسية تبطئ المدونة (مثل الصور غير المحسّنة، كثرة JavaScript/CSS، استخدام خطوط الويب بكثرة، الإضافات الثقيلة، كود إعلانات غير مُحسّن، DOM كبير).
          - **حلول عملية ومحددة لـ Blogger:** لكل مشكلة، قدم حلاً عمليًا ومباشراً يمكن تطبيقه على منصة Blogger، مع أمثلة أو إرشادات قصيرة.
          - **نصائح إضافية:** أي توصيات إضافية لزيادة تحسين Core Web Vitals وتجربة المستخدم بشكل عام.
          - **أدوات مساعدة:** اذكر بعض الأدوات التي يمكن استخدامها لقياس السرعة والتحقق من التحسينات (مثل PageSpeed Insights).

          تأكد من أن التقرير سهل الفهم وموجه لأصحاب المدونات غير التقنيين.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // نموذج قوي للتحليل وتقديم النصائح
      contents: [{
        parts: [{ text: promptText }]
      }],
      config: {
        tools: [{ googleSearch: {} }], // استخدام Google Search للمساعدة في grounding النصائح
        thinkingConfig: { thinkingBudget: 1500 },
      },
    });

    let resultText = response.text || "تعذر توليد اقتراحات تحسين السرعة.";

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      resultText += "\n\n### مصادر إضافية (Additional References)\n";
      const seenUrls = new Set();
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && !seenUrls.has(chunk.web.uri)) {
          resultText += `- [${chunk.web.title || chunk.web.uri}](${chunk.web.uri})\n`;
          seenUrls.add(chunk.web.uri);
        }
      });
    }

    return resultText;
  } catch (error) {
    console.error("Blog Speed Analysis Error:", error);
    throw new Error("فشل محرك أتلانتس في تحليل سرعة المدونة. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى.");
  }
};

// وظيفة جديدة: تحليل شامل للـ SEO
export const getSeoAuditSuggestions = async (posts: Post[], ga4Id: string | null): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  if (posts.length === 0) {
    return "لا توجد مقالات حالياً في مدونتك لإجراء فحص SEO شامل. يرجى إضافة بعض المقالات أولاً.";
  }

  const postsSummary = posts.map(p => `عنوان: ${p.title} | مقتطف: ${p.excerpt} | تصنيف: ${p.category} | كلمات مفتاحية SEO: ${p.seoDescription || 'غير محدد'}`).join("\n---\n");
  const ga4Status = ga4Id ? `معرف GA4 الحالي: ${ga4Id}.` : "معرف GA4 غير متصل، مما يحد من تحليل الأداء الدقيق.";

  try {
    const prompt = `بصفتك خبير SEO واستراتيجيات محتوى، قم بإجراء فحص SEO شامل لمدونة تعتمد على المقالات التالية:
\`\`\`
${postsSummary}
\`\`\`
${ga4Status}

قدم تقريراً مفصلاً بتنسيق Markdown يركز على:
- **تحليل العناوين والأوصاف (Titles & Meta Descriptions):** اقتراحات لتحسينها لزيادة CTR في نتائج البحث.
- **استراتيجية الكلمات المفتاحية:** تقييم الكلمات المفتاحية المستخدمة واقتراح كلمات مفتاحية جديدة ذات صلة وعالية القيمة.
- **تحسين الروابط الداخلية والخارجية:** كيف يمكن تحسين هيكل الروابط لتعزيز سلطة الصفحة وتحسين الأرشفة.
- **هيكل المحتوى:** نصائح لتحسين بنية المقالات (استخدام H1, H2, القوائم) لسهولة القراءة و SEO.
- **فرص SEO التقني:** توصيات عامة لتحسين الجوانب التقنية (مثل سرعة التحميل، التوافق مع الجوال، تحسين الصور - استناداً إلى المحتوى المقدم).
- **مراقبة الأداء:** كيف يمكن استخدام GA4 لمراقبة فعالية تحسينات SEO.

اجعل التقرير عملياً وقابلاً للتنفيذ، مع أمثلة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });
    return response.text || "تعذر إجراء فحص SEO الشامل.";
  } catch (error) {
    console.error("SEO Audit Error:", error);
    throw new Error("فشل محرك أتلانتس في إجراء فحص SEO الشامل.");
  }
};

// وظيفة جديدة: تحسين الأرباح
export const getMonetizationSuggestions = async (posts: Post[], ga4Id: string | null): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  if (posts.length === 0) {
    return "لا توجد مقالات حالياً في مدونتك لتحليل الأرباح. يرجى إضافة بعض المقالات أولاً.";
  }

  const postsData = posts.map(p => `عنوان: ${p.title} | تصنيف: ${p.category} | المشاهدات: ${p.views} | ربح محتمل: ${p.profitScore}%`).join("\n---\n");
  const ga4Status = ga4Id ? `معرف GA4 الحالي: ${ga4Id}. يمكن استخدامه لتحليل أداء الإعلانات.` : "معرف GA4 غير متصل، مما يحد من تحليل أداء الإعلانات بدقة.";

  try {
    const prompt = `بصفتك خبير استراتيجيات تحقيق الدخل عبر الإعلانات، قم بتحليل المدونة بناءً على المقالات التالية:
\`\`\`
${postsData}
\`\`\`
${ga4Status}

قدم تقريراً مفصلاً بتنسيق Markdown يركز على:
- **تحسين مواضع الإعلانات:** اقتراحات لأفضل أماكن عرض الإعلانات (داخل المقال، بعد المحتوى، الشريط الجانبي) لزيادة النقرات والأرباح.
- **أنواع الإعلانات:** ما هي أنواع إعلانات AdSense (عرض، في المقال، مرتبطة) الأكثر ملاءمة لكل فئة محتوى لتعظيم الربح؟
- **تحسين المحتوى للربح:** كيف يمكن تعديل أسلوب كتابة المقالات أو مواضيعها (على سبيل المثال، دمج الكلمات المفتاحية ذات CPC العالي) لزيادة قيمة النقرات.
- **توصيات لزيادة RPM:** استراتيجيات عامة لزيادة معدل الأرباح لكل ألف ظهور (RPM).
- **التوازن بين الإعلانات وتجربة المستخدم:** نصائح لزيادة الأرباح دون الإضرار بتجربة القارئ.
- **مراقبة الأداء المالي:** كيفية استخدام بيانات GA4 (إذا كانت متاحة) لمراقبة وتحسين أداء الإعلانات.

اجعل التقرير عملياً وقابلاً للتنفيذ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1500 }
      },
    });
    return response.text || "تعذر توليد اقتراحات تحسين الأرباح.";
  } catch (error) {
    console.error("Monetization Suggestions Error:", error);
    throw new Error("فشل محرك أتلانتس في توليد اقتراحات تحسين الأرباح.");
  }
};

// وظيفة جديدة: تعزيز التفاعل
export const getEngagementSuggestions = async (posts: Post[]): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  if (posts.length === 0) {
    return "لا توجد مقالات حالياً في مدونتك لتحليل التفاعل. يرجى إضافة بعض المقالات أولاً.";
  }

  const postsSummary = posts.map(p => `عنوان: ${p.title} | تصنيف: ${p.category} | المشاهدات: ${p.views} | مقتطف: ${p.excerpt}`).join("\n---\n");

  try {
    const prompt = `بصفتك خبير في تفاعل المستخدمين والمحتوى الجذاب، قم بتحليل المدونة بناءً على المقالات التالية:
\`\`\`
${postsSummary}
\`\`\`
قدم تقريراً مفصلاً بتنسيق Markdown يركز على:
- **تحسين المقدمات والخواتيم:** نصائح لجعل بدايات المقالات أكثر جاذبية ونهاياتها تحث على التفاعل (تعليقات، مشاركات).
- **تنسيقات المحتوى التفاعلية:** اقتراحات لإضافة عناصر تفاعلية (استطلاعات رأي، اختبارات قصيرة، رسوم بيانية تفاعلية، فيديوهات) لزيادة وقت البقاء.
- **نداءات الإجراء (CTAs):** كيف يمكن تحسين نداءات الإجراء لزيادة المشاركة، الاشتراك في القائمة البريدية، أو زيارة صفحات أخرى.
- **المشاركة الاجتماعية:** استراتيجيات لتشجيع القراء على مشاركة المحتوى على وسائل التواصل الاجتماعي.
- **تحسين قسم التعليقات:** نصائح لجعل قسم التعليقات أكثر حيوية وتفاعلية.
- **بناء المجتمع:** اقتراحات لبناء مجتمع حول المدونة لزيادة الولاء والتفاعل المتكرر.

اجعل التقرير عملياً وقابلاً للتنفيذ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1500 }
      },
    });
    return response.text || "تعذر توليد اقتراحات تعزيز التفاعل.";
  } catch (error) {
    console.error("Engagement Suggestions Error:", error);
    throw new Error("فشل محرك أتلانتس في توليد اقتراحات تعزيز التفاعل.");
  }
};

/**
 * وظيفة جديدة: توليد خطة تصميم وتدقيق قالب Blogger احترافي.
 */
export const generateBloggerTemplatePlan = async (blogUrl: string, ga4Id: string | null): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const ga4Status = ga4Id ? `معرف GA4 الحالي: ${ga4Id}. يمكن استخدامه لمراقبة أداء القالب.` : "معرف GA4 غير متصل. يوصى بربطه لمراقبة أداء القالب.";

  try {
    const promptText = `بصفتك خبيرًا متقدمًا في تصميم وتدقيق قوالب Blogger، وخبيراً في SEO، وAdSense، وتجربة المستخدم، قم بإنشاء خطة مفصلة وشاملة لتصميم وتدقيق قالب Blogger احترافي للمدونة: ${blogUrl}.
          ${ga4Status}

          قدم التقرير بتنسيق Markdown احترافي، مع التركيز على الجوانب التالية:

          ## خطة تصميم وتدقيق قالب Blogger احترافي لـ ${blogUrl}

          ### 1. تحسين محركات البحث (SEO-Friendly Design)
          - **هيكل HTML نظيف ودلالي:** كيف تضمن أن القالب يستخدم علامات HTML5 بشكل صحيح (مثل <header>, <nav>, <main>, <article>, <section>, <footer>) لتحسين فهم محركات البحث للمحتوى.
          - **سرعة التحميل (Page Speed):** توصيات لضمان أداء قالب سريع (مثل تقليل JavaScript/CSS، تحسين الصور، استخدام التحميل الكسول).
          - **التصميم المتجاوب (Responsive Design):** أهمية التوافق الكامل مع جميع الأجهزة (موبايل، تابلت، كمبيوتر) لتقليل معدل الارتداد.
          - **البيانات المهيكلة (Schema Markup):** نصائح لدمج Schema Markup (مثل Article, BlogPosting) في قالب Blogger لتعزيز ظهور المدونة في نتائج البحث الغنية.
          - **العلامات الوصفية المتقدمة:** كيفية تحسين علامات الميتا (Meta Tags) والعناوين (Titles) بشكل ديناميكي لكل صفحة.

          ### 2. توافق AdSense وتوليد الأرباح (AdSense Optimization)
          - **مواضع الإعلانات المثلى:** اقتراحات لأفضل الأماكن لدمج وحدات إعلانات AdSense داخل القالب (مثل أعلى المقال، منتصف المقال، بعد المحتوى، الشريط الجانبي) دون إزعاج المستخدم.
          - **تصميم غير مزعج:** كيفية الحفاظ على توازن بين الإعلانات وتجربة المستخدم، وتجنب الإفراط في الإعلانات.
          - **تحميل الإعلانات:** نصائح لضمان تحميل الإعلانات بشكل فعال دون إبطاء الصفحة.
          - **أنواع الإعلانات:** اقتراح أنواع إعلانات AdSense التي تتناسب بشكل جيد مع قوالب Blogger الحديثة (مثل الإعلانات المتجاوبة، الإعلانات ضمن المقال).

          ### 3. الأرشفة وخارطة الموقع (Sitemap & Indexing)
          - **هيكلة التنقل:** تصميم قائمة تنقل واضحة وسهلة الاستخدام، مع روابط داخلية قوية.
          - **صفحات الفئات/التصنيفات والوسوم:** تحسين طريقة عرض صفحات الأرشيف (Categories/Tags) لتكون قابلة للزحف والفهرسة بشكل جيد.
          - **خارطة الموقع الافتراضية لـ Blogger:** التأكد من أن Blogger يولد خارطة موقع XML صحيحة وأنها مقدمة لـ Google Search Console.
          - **الروابط المعطلة (Broken Links):** أهمية التحقق من عدم وجود روابط معطلة داخل القالب.

          ### 4. سياسات الخصوصية وملفات تعريف الارتباط (Privacy Policy & Cookies)
          - **سهولة الوصول لصفحة الخصوصية:** التأكد من وجود رابط واضح لصفحة سياسة الخصوصية في تذييل القالب.
          - **إشعار ملفات تعريف الارتباط (Cookie Consent):** إذا كان القالب يستخدم ملفات تعريف ارتباط تتطلب موافقة، فكيفية دمج إشعار فعال (خصوصاً لمتطلبات GDPR/CCPA).
          - **الامتثال لـ AdSense:** ضمان أن القالب يدعم متطلبات الخصوصية الخاصة بـ AdSense.

          ### 5. تصميم وتجربة المستخدم (UI/UX)
          - **جماليات عصرية:** تصميم بصري جذاب وحديث يعكس هوية المدونة.
          - **سهولة القراءة:** استخدام خطوط واضحة، تباعد أسطر مناسب، وتنسيق محتوى يريح العين.
          - **تحسين الجوال أولاً (Mobile-First):** ضمان أن القالب مصمم ليكون ممتازاً على الهواتف الذكية أولاً.
          - **العناصر التفاعلية:** أزرار المشاركة الاجتماعية، أقسام التعليقات، نماذج الاشتراك في القائمة البريدية.

          ### 6. نصائح تقنية لتطبيق القالب في Blogger
          - **تعديل HTML القالب:** إرشادات عامة حول كيفية الوصول إلى ملف HTML/XML الخاص بقالب Blogger وإجراء التعديلات (مع التنبيه لأهمية النسخ الاحتياطي).
          - **استخدام أدوات المطورين:** نصائح لاستخدام أدوات المطورين في المتصفح لفحص وتعديل CSS/HTML.

          قدم التوصيات بشكل عملي وواضح، مع أمثلة حيثما أمكن، لمساعدة صاحب المدونة غير التقني على فهمها وتطبيقها.
          `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // نموذج قوي للتحليل وتقديم النصائح المعقدة
      contents: [{
        parts: [{ text: promptText }]
      }],
      config: {
        tools: [{ googleSearch: {} }], // استخدام Google Search للمساعدة في grounding النصائح بأحدث المعلومات
        thinkingConfig: { thinkingBudget: 2000 }, // ميزانية تفكير أكبر لخطة مفصلة
      },
    });

    let resultText = response.text || "تعذر توليد خطة تصميم قالب Blogger.";

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      resultText += "\n\n### مصادر ومراجع إضافية (Additional References)\n";
      const seenUrls = new Set();
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && !seenUrls.has(chunk.web.uri)) {
          resultText += `- [${chunk.web.title || chunk.web.uri}](${chunk.web.uri})\n`;
          seenUrls.add(chunk.web.uri);
        }
      });
    }

    return resultText;
  } catch (error) {
    console.error("Blogger Template Plan Generation Error:", error);
    throw new Error("فشل محرك أتلانتس في توليد خطة تصميم قالب Blogger. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى.");
  }
};