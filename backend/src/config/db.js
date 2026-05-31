import dns from "dns";
import mongoose from "mongoose";

// Avoid flaky SRV lookups on some Windows/DNS setups (ECONNREFUSED on querySrv).
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
