import express from "express";
import { getBlogs, getBlogBySlug } from "./blog.controller.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
