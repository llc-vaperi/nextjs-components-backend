import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Show detailed logs
  logger: true, // Log information to console
});

console.log("--- SMTP Connection Test ---");
console.log("Email:", process.env.SMTP_USER);
console.log(
  "Password:",
  process.env.SMTP_PASS ? "****" + process.env.SMTP_PASS.slice(-4) : "MISSING"
);

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Connection Error:");
    console.error(error);
  } else {
    console.log("✅ Server is ready to take our messages!");
  }
});
