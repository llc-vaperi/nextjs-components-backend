import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("--- Cloudinary Connection Test ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "API Key:",
  process.env.CLOUDINARY_API_KEY
    ? "****" + process.env.CLOUDINARY_API_KEY.slice(-4)
    : "MISSING"
);

async function testConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful!", result);
  } catch (error) {
    console.log("❌ Cloudinary connection failed!");
    console.error(error);
  }
}

testConnection();
