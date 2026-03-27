import { createConnection } from "mongoose";
import { config } from "dotenv";
config();
const mongoUriAdmin = process.env.MONGO_URI_ADMIN;
const mongoUriWeb = process.env.MONGO_URI_WEB;
if (!mongoUriWeb) {
    console.error("❌ MONGO_URI_WEB is missing in .env");
    process.exit(1);
}
if (!mongoUriAdmin) {
    console.error("❌ MONGO_URI_ADMIN is missing in .env");
    process.exit(1);
}
export const webConnection = createConnection(mongoUriWeb)
    .on("connected", () => console.log("✅ DB connected goniflow_web"))
    .on("disconnected", () => console.log("❌ DB disconnected goniflow_web"))
    .on("error", (err) => {
    console.error("❌ DB error goniflow_web:", err);
    process.exit(1);
});
export const adminConnection = createConnection(mongoUriAdmin)
    .on("connected", () => console.log("✅ DB connected goniflow_admin"))
    .on("disconnected", () => console.log("❌ DB disconnected goniflow_admin"))
    .on("error", (err) => {
    console.error("❌ DB error goniflow_admin:", err);
});
