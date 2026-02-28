// path: src/components/components.model.ts

import { Schema, Model, Document, Connection } from "mongoose";
import { mainComponentConnection } from "../db/mongoDB.js";

// --- Interfaces for Type Safety (Exported for Controller use) ---

export interface AiMeta {
  theme: string;
  mood: string;
  target: string[];
  style: string;
}

export interface Author {
  id: string;
  name: string;
}

// Interface for the data you interact with (input/output)
export interface ComponentData {
  name: string;
  category: string;
  description: string;
  tags: string[];
  code: string;
  aiMeta: AiMeta;
  previewUrl: string;
  author: Author;
  isApproved: boolean;
  embedding: number[];
  createdAt?: Date; // Optional or added by Mongoose
  updatedAt?: Date; // Optional or added by Mongoose
}

// Interface for the Mongoose document (includes Mongoose properties like _id)
export interface ComponentDocument extends ComponentData, Document {}

// --- Mongoose Schema Definition ---

// The schema is defined based on the ComponentData structure
const componentsSchema = new Schema<ComponentDocument>(
  {
    name: { type: String, required: true }, // Added required for better Mongoose practice
    category: { type: String, required: true },
    description: String,
    tags: [String],
    code: { type: String, required: true },
    aiMeta: {
      theme: String,
      mood: String,
      target: [String],
      style: String
    },
    previewUrl: String,
    author: {
      id: String,
      name: String
    },
    isApproved: Boolean,
    embedding: [Number],
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() }
  },
  { timestamps: true }
); // Mongoose can handle createdAt/updatedAt automatically

// Export the Model with the correct type (ComponentDocument)
export const componentsModel: Model<ComponentDocument> =
  mainComponentConnection.model<ComponentDocument, Model<ComponentDocument>>(
    "Components",
    componentsSchema
  );
