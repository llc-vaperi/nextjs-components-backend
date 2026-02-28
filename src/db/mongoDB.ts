import { createConnection, Connection } from "mongoose";
import { config } from "dotenv";

config();

const mongoUriMain = process.env.MONGO_URI_MAINCOMPONENTS;
const mongoUriBlog = process.env.MONGO_URI_BLOG;

if (!mongoUriMain) {
  console.error("❌ MONGO_URI_MAINCOMPONENTS is missing in .env");
  process.exit(1);
}

export const mainComponentConnection: Connection = createConnection(mongoUriMain)
  .on("connected", () => console.log("DB connect main components"))
  .on("disconnected", () => console.log("❌ DB disconnected main components"))
  .on("error", (err) => {
    console.error("❌ DB error main components:", err);
    process.exit(1);
  });

export const blogConnection: Connection = createConnection(mongoUriBlog || "")
  .on("connected", () => console.log("✅ DB connect blog"))
  .on("disconnected", () => console.log("❌ DB disconnected blog"))
  .on("error", (err) => {
    console.error("❌ DB error blog:", err);
  });
