import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare global cache to avoid overwriting in a hot-reloading scenario in Next.js
declare global {
  // Using let here since global variables should be mutable
  var mongooseCache: MongooseCache | undefined;
}

// Since 'cached' will not be reassigned, use const instead of let
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function dbConnect() {
  // If a connection is already established, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one and connect
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection to be established
  cached.conn = await cached.promise;

  // Store the cache in the global object to reuse it in case of hot reloads
  global.mongooseCache = cached;

  return cached.conn;
}
