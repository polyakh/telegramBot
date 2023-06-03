import axios from 'axios'

//region Local Imports
import { EVENTS } from "./consts.mjs";
import { saveMessageToDatabase } from "../db/index.mjs";
import { isRateLimited, handleFirstVisit } from "./utilities.mjs";
//endregion

async function setupBotHandlers(inputBot) {
  inputBot.on(EVENTS.MESSAGE, async (msg) => {
    const {
      chat: { id: chatId },
      text: message,
      from: { first_name: firstName }
    } = msg;
    try {
      // Handle incoming messages
      handleIncomingMessage({ bot: inputBot, chatId, message, firstName });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
}

// !TODO check reconnection to db
function handleIncomingMessage({ bot, chatId, message, firstName }) {
  // Check if user is rate limited
  if (isRateLimited(chatId)) {
    bot.sendMessage(chatId, "You are sending too many requests. Please try again later.");
    return;
  }

  switch (true) {
    case /^\/start/i.test(message):
      handleFirstVisit({ bot, chatId, firstName });
      break;
    case /^\/Записатися на консультацію/i.test(message):
      handleSchedule(bot, chatId);
      break;
    case /^Keyboard$/i.test(message):
      handleSchedule(bot, chatId);
      break;
    default:
      handleSchedule(bot, chatId);
      break;
  }

  saveMessageToDatabase({ chatId, message, firstName });
}
const config = {
  headers: { 'Authorization': `Bearer ${process.env.CALENDLY_API_KEY}` }
};

async function handleSchedule(bot, chatId) {
  try {
    const response = await axios.get('https://api.calendly.com/users/me/events', config);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Sorry, an error occurred while fetching your events. Please try again later.');
  }
  
}

function handleHelloMessage({ bot, chatId, firstName }) {
  bot.sendMessage(chatId, `Hello, ${firstName}!`);
}

function handleUnknownMessage(bot, chatId) {
  bot.sendMessage(chatId, "Sorry, I don't understand.");
}

function handleReturningUser(bot, chatId) {
  bot.sendMessage(chatId, "Welcome back!");
}

function handleKeyboard(bot, chatId) {
  console.log('handleKeyboard')
}

export { setupBotHandlers };
