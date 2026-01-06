import { createConnection } from "mongoose";
import { config } from "dotenv";
config();

export const mainComponentConnection = createConnection(
  process.env.MONGO_URI_MAINCOMPONENTS
)
  .on("connected", () => console.log("DB connect main components"))
  .on("disconnected", () => console.log("❌ DB disconnected main components"))
  .on("error", () => {
    console.log("❌ DB error main components");
    process.exit(1);
  });

export const blogConnection = createConnection(process.env.MONGO_URI_BLOG)
  .on("connected", () => console.log("✅ DB connect blog"))
  .on("disconnected", () => console.log("❌ DB disconnected blog"))
  .on("error", () => {
    console.log("❌ DB error blog");
    // Don't exit process if blog DB fails
  });

// fixed duplicate
