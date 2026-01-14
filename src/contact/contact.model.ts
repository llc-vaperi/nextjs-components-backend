import { Schema, Model, Document } from "mongoose";
import { mainComponentConnection } from "../db/mongoDB.js";

export interface IContact extends Document {
  type: "contact" | "support";
  fullName: string;
  email: string;
  inquiryType?: string; // For Sales
  topic?: string; // For Support
  priority?: string; // For Support
  message: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentKey?: string; // R2 file key for deletion
  ticketId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    type: { type: String, enum: ["contact", "support"], required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    inquiryType: { type: String },
    topic: { type: String },
    priority: { type: String },
    message: { type: String, required: true },
    attachmentName: { type: String },
    attachmentUrl: { type: String },
    attachmentKey: { type: String },
    ticketId: { type: String },
  },
  { timestamps: true }
);

export const ContactModel: Model<IContact> =
  mainComponentConnection.model<IContact>("Contact", contactSchema);
