import express from "express";
import cors from "cors";
import cookiesParse from "cookie-parser";
import componentsRoutes from "./components/componentsRoutes.js";
import { startBlogCron } from "./blog/blogCron.js";

const configuration = {
  origin: ["http://localhost:3000", "https://next-componets-new.pages.dev"],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"], // Enhanced CORS
};
const app = express();

// Start Background Services
startBlogCron();

app.use(cors(configuration));
app.use(cookiesParse());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

import blogRoutes from "./blog/blog.routes.js";

// ... existing code ...

app.use("/api", componentsRoutes);
app.use("/api/blog", blogRoutes);

export default app;
