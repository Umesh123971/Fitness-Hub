const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection String:', process.env.MONGO_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Full Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;