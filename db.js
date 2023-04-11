const {MongoClient} = require('mongodb');

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
    console.log('Connected to MongoDB');
    cachedClient = client;
    return cachedClient;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function saveMessageToDatabase({chatId, message, firstName}) {
  const client = await connectToDatabase();
  const collenction = client.db(process.env.MONGO_DATABASE_NAME).collection(process.env.MONGO_DATABASE_COLLECTION_NAME);
  await collenction.insertOne({
    chatId,
    message,
    firstName,
    timestamp: getCurrentTimestamp(),
  });
}


const DATE_FORMAT = 'yyyy/MM/dd HH:mm:ss';

function getCurrentTimestamp(format = DATE_FORMAT) {
  const date = new Date();
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

module.exports = { connectToDatabase, saveMessageToDatabase };
