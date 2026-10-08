import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB using Mongoose with connection pooling and dev-server caching.
 * MongoDB MUST ONLY use process.env.MONGODB_URI.
 * If MONGODB_URI is missing or empty, throws a clear Error immediately instead of silently falling back to localhost.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri || !mongodbUri.trim()) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Please define MONGODB_URI in your environment settings (e.g., Vercel Environment Variables or .env.local)."
    );
  }

  const cleanUri = mongodbUri.trim();

  if (cached.conn) {
    if (cached.conn.connection.readyState === 1) {
      return cached.conn;
    }
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(cleanUri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
