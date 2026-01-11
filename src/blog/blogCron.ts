import cron from "node-cron";
import { generateBlogFunc } from "./blog.service.js";

export const startBlogCron = () => {
  // Schedule: Every Mon, Wed, Fri, Sun at 10:00 AM (4 times a week)
  // Cron format: Minute Hour DayOfMonth Month DayOfWeek
  cron.schedule("0 10 * * 1,3,5,0", async () => {
    // cron.schedule("* * * * *", async () => {
    console.log("⏰ Cron job triggered: Generating blog post...");
    try {
      // Topics pool (can be moved to DB later)
      const topics = [
        "How AI Agents are Transforming Web Development in 2026",
        "Gemini vs GPT-4o: Choosing the Right LLM for Your Next Project",
        "React 19 Deep Dive: New Hooks and Features for Developers",
        "Mastering Next.js Server Actions: A Complete Guide to Data Mutations",
        "Why Rust is Replacing JavaScript for Web Tooling",
        "Optimizing Core Web Vitals in Next.js for Better Google Rankings",
        "The Impact of Generative AI on Modern UI/UX Design Trends",
        "The Rise of Edge Computing: Deploying Your Backend Closer to Users",
        "Building Privacy-First AI Apps: Local LLMs and WebGPU",
        "Zustand vs TanStack Query: The Modern Way to Manage State and Data",
      ];

      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      await generateBlogFunc(randomTopic);
    } catch (error) {
      console.error("❌ Cron job failed:", error);
    }
  });

  console.log(
    "📅 Blog generation cron scheduled (Mon, Wed, Fri, Sun at 10:00 AM)"
  );
};
