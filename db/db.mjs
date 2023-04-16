//region Local Imports
import mongodb from "mongodb";
const { MongoClient } = mongodb;
//endregion

import { getCurrentDBСollection } from "../db/index.mjs";
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
    console.log("~Connected to MongoDB");
    cachedClient = client;
    return cachedClient;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function saveMessageToDatabase({ chatId, message, firstName }) {
  const collenction = await getCurrentDBСollection();
  await collenction.insertOne({
    chatId,
    message,
    firstName,
    timestamp: getCurrentTimestamp()
  });
}

export { connectToDatabase, saveMessageToDatabase };
