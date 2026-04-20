import { createConnection, Connection } from "mongoose";
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

const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  heartbeatFrequencyMS: 10000,
};

export const webConnection: Connection = createConnection(mongoUriWeb, connectionOptions)
  .on("connected", () => console.log("✅ DB connected: goniflow_web"))
  .on("reconnected", () => console.log("🔄 DB reconnected: goniflow_web"))
  .on("disconnected", () => console.log("❌ DB disconnected: goniflow_web"))
  .on("error", (err) => {
    console.error("❌ DB error: goniflow_web:", err);
    // process.exit(1); // Don't kill whole app on single connection flap
  });

export const adminConnection: Connection = createConnection(mongoUriAdmin, connectionOptions)
  .on("connected", () => console.log("✅ DB connected: goniflow_admin"))
  .on("reconnected", () => console.log("🔄 DB reconnected: goniflow_admin"))
  .on("disconnected", () => console.log("❌ DB disconnected: goniflow_admin"))
  .on("error", (err) => {
    console.error("❌ DB error: goniflow_admin:", err);
  });
