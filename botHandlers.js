const { EVENTS } = require('./consts');

const { saveMessageToDatabase } = require('./db');

async function setupBotHandlers(inputBot) {
  inputBot.on(EVENTS.MESSAGE, async (msg) => {
        const { chat: { id: chatId }, text: message, from: { first_name: firstName } } = msg;
        try {
          // Handle incoming messages
          await handleIncomingMessage(inputBot, chatId, message, firstName);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });
  }

  async function handleIncomingMessage(bot, chatId, message, firstName) {
    switch (true) {
      case /^hi|hello$/i.test(message):
        await handleHelloMessage(bot, chatId, firstName);
        break;
      default:
        await handleUnknownMessage(bot, chatId);
        break;
    }

    await saveMessageToDatabase({chatId, message, firstName});
  }
  
  async function handleHelloMessage(bot, chatId, firstName) {
    await bot.sendMessage(chatId, `Hello, ${firstName}!`);
  }
  
  async function handleUnknownMessage(bot, chatId) {
    await bot.sendMessage(chatId, 'Sorry, I don\'t understand.');
  }

  
  module.exports = { setupBotHandlers };