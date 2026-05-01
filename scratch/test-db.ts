
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const MONGO_URI_WEB = process.env.MONGO_URI_WEB;

async function test() {
  try {
    const conn = await mongoose.connect(MONGO_URI_WEB!, {
      serverSelectionTimeoutMS: 5000,
    });
    const component = await conn.connection.db.collection('components').findOne({});
    console.log('Sample Component:', JSON.stringify(component, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

test();
