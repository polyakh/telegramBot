import { connectToDatabase } from "./db.mjs";

const DATE_FORMAT = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
};

function getCurrentTimestamp(format = DATE_FORMAT) {
  return new Intl.DateTimeFormat("en-US", format).format(new Date());
}
async function getCurrentDBСollection() {
  return await connectToDatabase()
    .db(process.env.MONGO_DATABASE_NAME)
    .collection(process.env.MONGO_DATABASE_COLLECTION_NAME);
}

export { getCurrentTimestamp, getCurrentDBСollection };
