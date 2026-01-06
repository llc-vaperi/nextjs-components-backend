import { GoogleGenAI } from "@google/genai";
import { BlogModel } from "./blog.model.js";

// Initialize Gemini (New SDK)
// Docs say it looks for GEMINI_API_KEY, but we have GOOGLE_API_KEY, so we pass it explicitly.
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Vertex AI client for Imagen (separate from Gemini text generation)
const vertexAI = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT || "goniflow-blog",
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

// Image Generation Function using Google Imagen 3
const generateImage = async (prompt: string): Promise<string> => {
  console.log("🎨 Generating Image with Google Imagen 3 for:", prompt);

  try {
    const response = await vertexAI.models.generateImages({
      model: "imagen-3.0-generate-001",
      prompt: prompt + ", realistic, 8k, high quality, futuristic tech style",
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
      },
    });

    console.log("ImageData:", response);

    // Extract the generated image
    if (
      response &&
      response.generatedImages &&
      response.generatedImages.length > 0
    ) {
      const imageData = response.generatedImages[0];

      // TODO: Upload base64 image to cloud storage (AWS S3, Google Cloud Storage, etc.)
      // For now, return a placeholder until storage is configured
      console.log("✅ Imagen generated successfully");
      console.log("⚠️ Image storage not yet configured, using placeholder");

      return `https://placehold.co/800x450/4F46E5/FFFFFF?text=Imagen+Generated`;
    }

    throw new Error("No image data returned from Imagen");
  } catch (error: any) {
    console.error("❌ Imagen generation failed:", error.message);
    console.log(
      "💡 Run 'gcloud auth application-default login' to enable Imagen"
    );
    return `https://placehold.co/800x450/DC2626/FFFFFF?text=Auth+Required`;
  }
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
