//region Global Imports
import TelegramBot from "node-telegram-bot-api";
import https from "https";
import { readFileSync } from "fs";
//endregion

//region Local Imports
import { setupBotHandlers } from "./botHandlers.mjs";
import { connectToDatabase } from "../db/index.mjs";
//endregion

const {TELEGRAM_BOT_TOKEN, PORT, HEROKU_APP_NAME} = process.env;
const options = {
  // key: readFileSync('../server.key'),
  // cert: readFileSync('../server.crt')
};

async function startBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    throw "ERROR: env variables not set.";
  }
  try {
    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { webHook: { port: PORT } });
    await setupBotHandlers(bot);
    await connectToDatabase();
    console.log("Telegram bot started");
    const url = `https://${HEROKU_APP_NAME}.herokuapp.com:${PORT}`;
    await bot.setWebHook(`${url}/${TELEGRAM_BOT_TOKEN}`, {
      max_connections: 1,
    });
  } catch (error) {
    console.error("Error starting Telegram bot:", error);
    process.exit(1);
  }
}

export { startBot };
