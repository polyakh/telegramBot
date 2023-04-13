//region Local Imports
import { EVENTS } from "./consts.mjs";
import { saveMessageToDatabase } from "../db/db.mjs";
import { isRateLimited } from "./utilities.mjs";
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
      await handleIncomingMessage(inputBot, chatId, message, firstName);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
}

async function handleIncomingMessage(bot, chatId, message, firstName) {
  // Check if user is rate limited
  if (isRateLimited(chatId)) {
    await bot.sendMessage(chatId, "You are sending too many requests. Please try again later.");
    return;
  }

  switch (true) {
    case /^hi|hello$/i.test(message):
      await handleHelloMessage(bot, chatId, firstName);
      break;
    default:
      await handleUnknownMessage(bot, chatId);
      break;
  }

  await saveMessageToDatabase({ chatId, message, firstName });
}

async function handleHelloMessage(bot, chatId, firstName) {
  await bot.sendMessage(chatId, `Hello, ${firstName}!`);
}

async function handleUnknownMessage(bot, chatId) {
  await bot.sendMessage(chatId, "Sorry, I don't understand.");
}

export { setupBotHandlers };
