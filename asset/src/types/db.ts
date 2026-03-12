import mongoose from "mongoose";

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) return 1;
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("💚 DB connected");
  } catch (err) {
    console.log("💔 DB CONNECTION ERR => ", err);
  }
}
