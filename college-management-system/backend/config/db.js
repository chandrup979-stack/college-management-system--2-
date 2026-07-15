const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_management";

  if (!process.env.MONGO_URI) {
    console.warn(
      "Warning: MONGO_URI not set in environment. Falling back to local MongoDB at mongodb://127.0.0.1:27017/college_management"
    );
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;