import { connectToDatabase } from "./db.mjs";

import { DATE_FORMAT } from "./consts.mjs";

function getCurrentTimestamp(format = DATE_FORMAT) {
  return new Intl.DateTimeFormat("en-US", format).format(new Date());
}
async function getCurrentDBСollection() {
  const client = await connectToDatabase();
  return client.db(process.env.MONGO_DATABASE_NAME).collection(process.env.MONGO_DATABASE_COLLECTION_NAME);
}

export { getCurrentTimestamp, getCurrentDBСollection };
