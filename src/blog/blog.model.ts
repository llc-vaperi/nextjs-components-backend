import { Schema } from "mongoose";
import { blogConnection } from "../db/mongoDB.js";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // HTML content
    excerpt: { type: String },
    mainImage: { type: String }, // URL of the generated image
    tags: [{ type: String }],
    author: {
      name: { type: String, default: "AI Assistant" },
      avatar: { type: String },
    },
    aiMeta: {
      model: { type: String },
      prompt: { type: String },
      generatedAt: { type: Date, default: Date.now },
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BlogModel = blogConnection.model("Blog", blogSchema);
