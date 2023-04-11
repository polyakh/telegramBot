const TelegramBot = require('node-telegram-bot-api');

const { setupBotHandlers } = require('./botHandlers');
const { connectToDatabase } = require('./db');
const token = process.env.TELEGRAM_BOT_TOKEN;

async function startBot() {
  if (!token) {
    throw "ERROR: env variables not set.";
  }
  try {
    const bot = new TelegramBot(token, { polling: true });
    await setupBotHandlers(bot);
    await connectToDatabase();
    console.log('Telegram bot started');
  } catch (error) {
    console.error('Error starting Telegram bot:', error);
    process.exit(1);
  }
}

module.exports = { startBot };