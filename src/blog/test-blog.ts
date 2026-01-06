import { generateBlogFunc } from "./blog.service.js";
import { config } from "dotenv";

// Load environment variables
config();

const runTest = async () => {
  try {
    console.log("🚀 Starting verification test...");
    const blog = await generateBlogFunc(
      "Latest Trends in React Server Components"
    );
    console.log("✅ Test PASSED!");
    console.log("Title:", blog.title);
    console.log("Slug:", blog.slug);
    process.exit(0);
  } catch (error) {
    console.error("❌ Test FAILED:", error);
    process.exit(1);
  }
};

runTest();
