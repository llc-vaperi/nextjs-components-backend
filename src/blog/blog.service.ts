import { GoogleGenAI } from "@google/genai";
import { BlogModel } from "./blog.model.js";

import OpenAI from "openai";

// Initialize Gemini (New SDK)
// Docs say it looks for GEMINI_API_KEY, but we have GOOGLE_API_KEY, so we pass it explicitly.
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Image Generation Function using Grok (xAI) via OpenAI SDK
const generateImage = async (prompt: string): Promise<string> => {
  console.log("🎨 Generating Image with Grok (xAI) for:", prompt);

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ XAI_API_KEY is missing. Using Fallback.");
    return generateFallbackImage(prompt);
  }

  const openai = new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: apiKey,
  });

  try {
    const response = await openai.images.generate({
      model: "grok-2-image-1212",

      prompt:
        prompt +
        ", realistic, 8k, high quality, futuristic tech style, 16:9 aspect ratio",
      n: 1,
      response_format: "url",
    });

    if (response.data && response.data.length > 0 && response.data[0].url) {
      console.log("✅ Grok Image generated successfully");
      return response.data[0].url;
    }

    throw new Error("Invalid response format from xAI");
  } catch (error: any) {
    console.error("❌ Grok generation failed, using Fallback:", error.message);
    return generateFallbackImage(prompt);
  }
};

const generateFallbackImage = (prompt: string): string => {
  // Extract simple keywords for text display
  const keywords = prompt.split(" ").slice(0, 3).join(" ");

  // Using Placehold.co for reliable placeholders
  return `https://placehold.co/800x400?text=${encodeURIComponent(keywords)}`;
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

interface BlogResponse {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  imagePrompt: string;
}

export const generateBlogFunc = async (topic?: string) => {
  try {
    const searchTopic = topic || "Future of Web Development";
    console.log(`🤖 Starting blog generation for: ${searchTopic}`);

    // structured formatting prompt
    const prompt = `
      Write a comprehensive technical blog post about "${searchTopic}".
      Ensure the content is in Markdown format (use # for headers, ** for bold, - for lists, and \`\`\` for code).
      The 'content' field must contain the full blog post body.
      The 'imagePrompt' should be a detailed description for an AI image generator.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        excerpt: { type: "STRING" },
        content: { type: "STRING" },
        tags: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
        imagePrompt: { type: "STRING" },
      },
      required: ["title", "excerpt", "content", "tags", "imagePrompt"],
    };

    // New SDK call format with Schema
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema as any, // Casting to any to avoid potential strict typing issues with specific SDK versions
      },
    });

    const responseText = result.text;
    if (!responseText) throw new Error("Empty response from Gemini");

    console.log("📝 Gemini Response Length:", responseText.length);

    let blogData: BlogResponse;
    try {
      // With responseSchema, the text is guaranteed to be valid JSON
      blogData = JSON.parse(responseText);
    } catch (e) {
      console.error("JSON Parse Error (Allocated Fallback):", e);
      // Fallback manual cleanup if schema fails heavily (unlikely)
      const cleanJson = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      blogData = JSON.parse(cleanJson);
    }

    const imageUrl = await generateImage(blogData.imagePrompt);

    const newBlog = await BlogModel.create({
      title: blogData.title,
      slug: generateSlug(blogData.title) + "-" + Date.now(),
      content: blogData.content,
      excerpt: blogData.excerpt,
      mainImage: imageUrl,
      tags: blogData.tags,
      aiMeta: {
        model: "gemini-2.5-flash",
        prompt: prompt,
      },
    });

    console.log(`✅ Blog created: ${newBlog.title}`);
    return newBlog;
  } catch (error) {
    console.error("❌ Blog generation failed:", error);
    throw error;
  }
};
