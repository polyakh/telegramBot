//region Global Imports
import TelegramBot from "node-telegram-bot-api";
import https from "https";
import { readFileSync } from "fs";
//endregion

//region Local Imports
import { setupBotHandlers } from "./botHandlers.mjs";
import { connectToDatabase } from "../db/index.mjs";
//endregion

const token = process.env.TELEGRAM_BOT_TOKEN;
const options = {
  // key: readFileSync('../server.key'),
  // cert: readFileSync('../server.crt')
};

async function startBot() {
  if (!token) {
    throw "ERROR: env variables not set.";
  }
  try {
    const bot = new TelegramBot(token, { polling: true });
    await setupBotHandlers(bot);
    await connectToDatabase();
    console.log("Telegram bot started");
  } catch (error) {
    console.error("Error starting Telegram bot:", error);
    process.exit(1);
  }
}

export { startBot };
