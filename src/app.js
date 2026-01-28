import express from "express";
import cors from "cors";
import cookiesParse from "cookie-parser";
import compression from "compression"; // Gzip compression
import helmet from "helmet"; // Security headers
import componentsRoutes from "./components/componentsRoutes.js";
import { startBlogCron } from "./blog/blogCron.js";

const configuration = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://next-componets-new.pages.dev",
    "https://test.goniflow.com",
    "https://test.goniflow.ovh",
    "https://next-componets-new.pages.dev",
    process.env.CORS_URL,
  ],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"], // Enhanced CORS
};
const app = express();

// Start Background Services
startBlogCron();

app.use(helmet()); // Security Headers
app.use(compression()); // Gzip Compression
app.use(cors(configuration));
app.use(cookiesParse());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

import blogRoutes from "./blog/blog.routes.js";
import contactRoutes from "./contact/contact.routes.js";

// ... existing code ...

app.use("/api", componentsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);

export default app;
