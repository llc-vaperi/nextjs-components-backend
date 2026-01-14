import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize R2 Client
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileKey: string;
}

/**
 * Upload file to Cloudflare R2
 * @param filePath - Local file path
 * @param originalName - Original filename
 * @returns Upload result with public URL
 */
export async function uploadToR2(
  filePath: string,
  originalName: string
): Promise<UploadResult> {
  try {
    // Read file from disk
    const fileBuffer = fs.readFileSync(filePath);

    // Generate unique key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const ext = path.extname(originalName);
    const fileKey = `attachments/${timestamp}-${randomString}${ext}`;

    // Determine content type
    const contentType = getContentType(ext);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: contentType,
      // Optional: Add metadata
      Metadata: {
        originalName: originalName,
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    // Construct public URL
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

    console.log(`✅ File uploaded to R2: ${fileKey}`);

    return {
      fileName: originalName,
      fileUrl: fileUrl,
      fileKey: fileKey,
    };
  } catch (error) {
    console.error("R2 upload failed:", error);
    throw new Error("Failed to upload file to R2");
  }
}

/**
 * Delete file from R2 (optional cleanup)
 */
export async function deleteFromR2(fileKey: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
    });
    await r2Client.send(command);
    console.log(`🗑️ File deleted from R2: ${fileKey}`);
  } catch (error) {
    console.error("R2 deletion failed:", error);
    throw error;
  }
}

/**
 * Generate presigned URL for private files (if needed)
 */
export async function getPresignedUrl(
  fileKey: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileKey,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Helper: Determine content type from file extension
 */
function getContentType(ext: string): string {
  const types: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
  };
  return types[ext.toLowerCase()] || "application/octet-stream";
}
