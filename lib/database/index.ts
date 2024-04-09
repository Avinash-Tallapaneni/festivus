import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

const connectToDB = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (cached.conn) {
    return cached.conn;
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "Festivus",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

export default connectToDB;
