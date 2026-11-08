const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devcollab';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // Fast failover if local DB daemon is not running
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.log('ℹ️ Running with graceful fallback (API routes remain operational).');
    return false;
  }
};

module.exports = connectDB;
