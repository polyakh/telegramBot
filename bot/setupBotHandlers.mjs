import { EVENTS } from "./consts.mjs";
import { handleIncomingMessage, handleCallbackQuery } from "./handlers.mjs";

async function setupBotHandlers(inputBot) {
  inputBot.on(EVENTS.MESSAGE, (msg) => {
    const {
      chat: { id: chatId },
      text: message,
      from: { first_name: firstName },
      reply_to_message
    } = msg;
    console.log('@', reply_to_message)
    try {
      // Handle incoming messages
      handleIncomingMessage({ bot: inputBot, chatId, message, firstName, reply_to_message });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });


  
  inputBot.on(EVENTS.CALLBACK_QUERY, (callbackQuery) => {
    try {
      handleCallbackQuery(inputBot, callbackQuery);
    } catch (error) {
      console.error(`Error ${EVENTS.CALLBACK_QUERY}:`, error);
    }
  });
}

export { setupBotHandlers };
