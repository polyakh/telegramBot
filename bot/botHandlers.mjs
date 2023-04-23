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
  console.log('handleSchedule')
  try {
    const response = await axios.get('https://api.calendly.com/users/me/events', config);

    // Get the list of events from the response
    const events = response.data.collection;

    // Create a list of events to display
    const eventList = events.map((event, index) => {
      return `${index + 1}. ${event.name} - ${event.start_time}`;
    });

    // Display the list of events and ask the user to select one or more events
    bot.sendMessage(chatId, `Here are your upcoming events:\n\n${eventList.join('\n')}\n\nPlease select one or more events by entering the corresponding numbers separated by commas.`);

    // Wait for the user to respond with their selection
    bot.once('message', async (selectedMsg) => {
      // Parse the user's selection
      const selectedEvents = selectedMsg.text.split(',').map((number) => {
        return events[number - 1];
      });

      // Create a message with the selected events
      let reply = '';
      selectedEvents.forEach((event) => {
        // reply += `Event Name: ${event.name}\nStart Time: ${event.start_time}\n\n`;
      });

      // Send the message with the selected events to the user
      bot.sendMessage(chatId, `You have selected the following events:\n\n${reply}`);
    });
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
