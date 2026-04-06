// path: src/components/components.model.ts

import { Schema, Model, Document, Connection } from "mongoose";
import { webConnection } from "../db/mongoDB.js";

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

export interface ComponentData {
  name: string;
  category: string;
  description: string;
  tags: string[];
  code: string;
  style?: string;
  dependencies?: string[];
  warningFlags?: string[];
  aiModel?: string;
  version?: number;
  
  visualVibe?: string;
  layoutType?: string;
  editableProps?: string[];
  contentFields?: any;
  
  isApproved: boolean;
  isActive?: boolean;
  
  searchText?: string;
  embeddingStatus?: string;
  embeddingModel?: string;
  embeddingDimensions?: number;
  embeddingError?: string;
  embeddingUpdatedAt?: Date;

  // Legacy fields (optional)
  aiMeta?: {
    theme: string;
    mood: string;
    target: string[];
    style: string;
  };
  previewUrl?: string;
  author?: {
    id: string;
    name: string;
  };
  embedding?: number[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ComponentDocument extends ComponentData, Document {}

const componentsSchema = new Schema<ComponentDocument>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    tags: { type: [String], default: [] },
    code: { type: String, required: true },
    style: { type: String },
    dependencies: { type: [String], default: [] },
    warningFlags: { type: [String], default: [] },
    aiModel: { type: String },
    version: { type: Number, default: 1 },
    
    visualVibe: { type: String },
    layoutType: { type: String },
    editableProps: { type: [String], default: [] },
    contentFields: { type: Schema.Types.Mixed, default: {} },
    
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    searchText: { type: String },
    embeddingStatus: { 
      type: String, 
      enum: ['pending', 'ready', 'failed'], 
      default: 'pending' 
    },
    embeddingModel: { type: String },
    embeddingDimensions: { type: Number },
    embeddingError: { type: String },
    embeddingUpdatedAt: { type: Date },

    // Legacy Support
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
    embedding: [Number],
  },
  { timestamps: true, strict: false } // strict false allows reading unmapped fields if needed
);

// Export the Model with the correct type (ComponentDocument)
export const componentsModel: Model<ComponentDocument> =
  webConnection.model<ComponentDocument, Model<ComponentDocument>>(
    "Components",
    componentsSchema
  );
