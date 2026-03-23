// path: src/components/components.model.ts
import { Schema } from "mongoose";
import { mainComponentConnection } from "../db/mongoDB.js";
// --- Mongoose Schema Definition ---
// The schema is defined based on the ComponentData structure
const componentsSchema = new Schema({
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
}, { timestamps: true }); // Mongoose can handle createdAt/updatedAt automatically
// Export the Model with the correct type (ComponentDocument)
export const componentsModel = mainComponentConnection.model("Components", componentsSchema);
