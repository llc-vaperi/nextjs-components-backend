import { Schema } from "mongoose";
import { adminConnection } from "../db/mongoDB.js";
const contactSchema = new Schema({
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
}, { timestamps: true });
export const ContactModel = adminConnection.model("Contact", contactSchema);
