import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {
  await client.connect();
  db = client.db("bookstore_web");  // ← make sure this matches Atlas
  console.log("Connected to MongoDB Atlas, DB:", db.databaseName);
}

export function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
