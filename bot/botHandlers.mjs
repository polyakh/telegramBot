//region Local Imports
import { EVENTS } from "./consts.mjs";
import { saveMessageToDatabase, connectToDatabase, getCurrentDBСollection } from "../db/index.mjs";
import { isRateLimited } from "./utilities.mjs";

//endregion

async function setupBotHandlers(inputBot) {
  inputBot.on(EVENTS.MESSAGE, async (msg) => {
    console.log("Message:", msg?.chat);
    const {
      chat: { id: chatId },
      text: message,
      from: { first_name: firstName }
    } = msg;
    try {
      // Handle incoming messages
      await handleIncomingMessage({bot: inputBot, chatId, message, firstName});
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
}


// !TODO check reconnection to db
async function handleIncomingMessage({bot, chatId, message, firstName}) {
  console.log('~~, chatId', chatId)
  // Check if user is rate limited
  if (isRateLimited(chatId)) {
    await bot.sendMessage(chatId, "You are sending too many requests. Please try again later.");
    return;
  }

  // const collenction = await getCurrentDBСollection();
  // const user = await collenction.findOne({ chatId });

  // if (!user) {
  //   await collenction.insertOne({ chatId, visited: true });
  // } else {
  //   await handleReturningUser(bot, chatId);
  // }

  switch (true) {
    case /^\/start/i.test(message):
      await handleFirstVisit({bot, chatId, firstName});
      break;

    case /^Keyboard$/i.test(message):
      await handleKeyboard(bot, chatId);
      break;  
    case /^hi|hello$/i.test(message):
      await handleHelloMessage({bot, chatId, firstName});
      break;
    default:
      await handleUnknownMessage(bot, chatId);
      break;
  }

  await saveMessageToDatabase({ chatId, message, firstName });
}

async function handleHelloMessage({bot, chatId, firstName}) {
  await bot.sendMessage(chatId, `Hello, ${firstName}!`);
}

async function handleUnknownMessage(bot, chatId) {
  await bot.sendMessage(chatId, "Sorry, I don't understand.");
}

async function handleFirstVisit({bot, chatId, firstName}) {
  console.log("First visit:", chatId);
  await bot.sendMessage(chatId, `${firstName}, привет я твой личный телеграмм-бот 😎!`, {
    "reply_markup": {
        "keyboard": [["Sample text", "Second sample"],   ["Keyboard"], ["I'm robot"]],
        "one_time_keyboard": true
        }
    });
}

async function handleReturningUser(bot, chatId) {
  await bot.sendMessage(chatId, "Welcome back!");
}

export { setupBotHandlers };
