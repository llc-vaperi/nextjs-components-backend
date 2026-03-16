
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUriBlog = process.env.MONGO_URI_BLOG;

async function checkBlogs() {
    if (!mongoUriBlog) {
        console.error("MONGO_URI_BLOG is missing");
        return;
    }
    const conn = await mongoose.createConnection(mongoUriBlog).asPromise();
    const blogSchema = new mongoose.Schema({}, { strict: false });
    const Blog = conn.model('Blog', blogSchema);
    const count = await Blog.countDocuments();
    const publishedCount = await Blog.countDocuments({ isPublished: true });
    console.log(`Total blogs: ${count}`);
    console.log(`Published blogs: ${publishedCount}`);
    if (count > 0) {
        const sample = await Blog.findOne();
        console.log("Sample blog:", JSON.stringify(sample, null, 2));
    }
    await conn.close();
}

checkBlogs().catch(console.error);
