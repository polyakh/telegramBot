//region Global Imports
import TelegramBot from "node-telegram-bot-api";
import https from "https";
import { readFileSync } from "fs";
//endregion

//region Local Imports
import { setupBotHandlers } from "./botHandlers.mjs";
import { connectToDatabase } from "../db/index.mjs";
//endregion

const {TELEGRAM_BOT_TOKEN, PORT, HEROKU_APP_NAME, APP_URL} = process.env;
const options = {
  webHook: { port: PORT }
  // key: readFileSync('../server.key'),
  // cert: readFileSync('../server.crt')
};


async function startBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    throw "ERROR: env variables not set.";
  }
  try {
    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, options);
    await setupBotHandlers(bot);
    await connectToDatabase();
    console.log("Telegram bot started");
    await bot.setWebHook(APP_URL, {
      max_connections: 1,
    });
  } catch (error) {
    console.error("Error starting Telegram bot:", error);
    process.exit(1);
  }
}

export { startBot };
