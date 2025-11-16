import { Schema } from "mongoose";
import { mainComponentConnection } from "../db/mongoDB.js";

const componentsSchema = new Schema({
  name: String,
  category: String,
  description: String,
  tags: [String],
  code: String,
  aiMeta: {
    theme: String,
    mood: String,
    target: [String],
    style: String,
  },
  previewUrl: String,
  author: {
    id: String,
    name: String,
  },
  isApproved: Boolean,
  embedding: [Number],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const componentsModel = mainComponentConnection.model(
  "Components",
  componentsSchema
);
