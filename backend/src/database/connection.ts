import mongoose from 'mongoose';
import { config } from '../config/index.js';

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    // Configure Mongoose options for cloud cluster reliability
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to Atlas host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection Failure:', error);
    throw error;
  }
};
