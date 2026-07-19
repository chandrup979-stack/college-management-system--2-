const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_management";

  if (!process.env.MONGO_URI) {
    console.warn(
      "Warning: MONGO_URI not set in environment. Falling back to local MongoDB at mongodb://127.0.0.1:27017/college_management"
    );
  }

  try {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    const conn = await mongoose.connect(mongoUri, options);
    const host = conn && conn.connection && conn.connection.host ? conn.connection.host : 'unknown-host';
    if (mongoUri.startsWith('mongodb+srv://')) {
      console.log(`MongoDB Connected (Atlas): ${host}`);
    } else {
      console.log(`MongoDB Connected: ${host}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (/querySrv|ECONNREFUSED/i.test(error.message || '')) {
      console.error('Hint: DNS SRV lookup failed for mongodb+srv URI. Either whitelist your IP in Atlas, allow DNS resolution, or use a standard mongodb:// connection string.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;