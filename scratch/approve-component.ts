
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const MONGO_URI_WEB = process.env.MONGO_URI_WEB;

async function approve() {
  try {
    const conn = await mongoose.connect(MONGO_URI_WEB!, {
      serverSelectionTimeoutMS: 5000,
    });
    const result = await conn.connection.db.collection('components').updateOne(
      { name: 'Navigation-Header' },
      { $set: { isApproved: true } }
    );
    console.log('Update result:', result);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

approve();
