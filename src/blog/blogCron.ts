import cron from "node-cron";
import { generateBlogFunc } from "./blog.service.js";

export const startBlogCron = () => {
  // Schedule: Every Tuesday at 10:00 AM
  // Cron format: Minute Hour DayOfMonth Month DayOfWeek
  // cron.schedule("0 10 * * 2", async () => {
  cron.schedule("0 10 * * 2", async () => {
    console.log("⏰ Cron job triggered: Generating blog post...");
    try {
      // Topics pool (can be moved to DB later)
      const topics = [
        "The Future of Next.js",
        "Optimizing React Performance",
        "Advanced CSS Techniques with Tailwind",
        "Why Accessibility Matters in 2024",
        "Building Scalable Backend API with Node.js",
      ];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      await generateBlogFunc(randomTopic);
    } catch (error) {
      console.error("❌ Cron job failed:", error);
    }
  });

  console.log("📅 Blog generation cron scheduled (Every Tuesday 10:00 AM)");
};
