import { Request, Response } from "express";
import { BlogModel } from "./blog.model.js";

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogModel.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    // Cache for 5 minutes (300s), s-w-r for 10 minutes (600s)
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await BlogModel.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cache for 10 minutes (600s), s-w-r for 1 hour (3600s)
    res.set(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=3600",
    );
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
