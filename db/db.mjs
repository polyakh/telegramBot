//region Local Imports
import MongoClient from "mongodb";
//endregion

import { getCurrentTimestamp } from "./utilities.mjs";

let cachedClient;

async function connectToDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw "ERROR: env variables not set.";
  }

  if (cachedClient) {
    return cachedClient;
  }
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    cachedClient = client;
    return cachedClient;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function saveMessageToDatabase({ chatId, message, firstName }) {
  const client = await connectToDatabase();
  const collenction = client.db(process.env.MONGO_DATABASE_NAME).collection(process.env.MONGO_DATABASE_COLLECTION_NAME);
  await collenction.insertOne({
    chatId,
    message,
    firstName,
    timestamp: getCurrentTimestamp()
  });
}

export { connectToDatabase, saveMessageToDatabase };
