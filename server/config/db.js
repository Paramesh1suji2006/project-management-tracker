import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server will continue running without database connection.');
    console.warn('⚠️  To fix: Install MongoDB locally or configure MongoDB Atlas connection.');
    // Don't exit - allow server to start for frontend development
  }
};

export default connectDB;
