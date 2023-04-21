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
      await handleIncomingMessage({ bot: inputBot, chatId, message, firstName });
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
    case /^Keyboard$/i.test(message):
      handleKeyboard(bot, chatId);
      break;
    default:
      handleUnknownMessage(bot, chatId);
      break;
  }

  saveMessageToDatabase({ chatId, message, firstName });
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

export { setupBotHandlers };
