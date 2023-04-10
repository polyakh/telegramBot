const TelegramBot = require('node-telegram-bot-api');

const connectToDatabase = require('./db');

// Replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

async function startBot() {
// Listen for incoming messages
bot.on('message', async (msg) => {
    const { chat: { id: chatId }, text: message, from: { first_name: firstName } } = msg;
  
    try {
        const client = await connectToDatabase();

      // Handle incoming messages
      switch (true) {
        case /^hi|hello$/i.test(message):
          await bot.sendMessage(chatId, `Мне скучно шо будем делать, ${firstName}!`);
          break;  
        default:
          await bot.sendMessage(chatId, 'Sorry, I don\'t understand.');
          break;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } 
    finally {
        // Close the MongoDB client
        await client.close();
    }
  });
}

module.exports = startBot;