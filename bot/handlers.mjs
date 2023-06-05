//region Local Imports
import { CALLBACK_EVENTS } from "./consts.mjs";
import { saveMessageToDatabase } from "../db/index.mjs";
import { isRateLimited } from "./utilities/isRateLimited.mjs";
//endregion

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
    default:
      handleUnknownMessage(bot, chatId);
      break;
  }

  // saveMessageToDatabase({ chatId, message, firstName });
}

function handleCallbackQuery(bot, { data, message }) {
  if (data === CALLBACK_EVENTS.book_activity_registration) {
    const { message_id } = bot.sendMessage(
      message.chat.id,
      "Підкажіть, будь ласка, ваше ім'я? Це необхідно для розуміння як до вас звертатися",
      {
        reply_markup: {
          force_reply: true
        }
      }
    );
  }
}

function handleFirstVisit({ bot, chatId, firstName }) {
  bot.sendMessage(
    chatId,
    `Привіт, ${firstName} 🙋‍♀️Тебе вітає Legal Expert-бот. 
Тут ти знайдеш інформацію щодо юридичних послуг для тебе і твого бізнесу
Тисни старт та обирай ту юридичну послугу, яка тобі пасує
  `,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Записатися на консультацію",
              url: process.env.CALENDLY_SCHEDULING_URL
            }
          ],
          [
            {
              text: "Запис на реєстрацію діяльності",
              callback_data: "book_activity_registration"
            }
          ],
          [
            {
              text: "Легалізація",
              callback_data: "request_legalization"
            }
          ]
        ]
      }
    }
  );
}

function handleUnknownMessage(bot, chatId) {
  bot.sendMessage(chatId, "Sorry, I don't understand.");
}

function handleReturningUser(bot, chatId) {
  bot.sendMessage(chatId, "Welcome back!");
}

export { handleIncomingMessage, handleCallbackQuery, handleFirstVisit }