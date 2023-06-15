//region Local Imports
import { CALLBACK_EVENTS, chatState } from "./consts.mjs";
import { saveMessageToDatabase } from "../db/index.mjs";
import { messageIdsMap } from './sharedState.mjs'
import { isRateLimited } from "./utilities/isRateLimited.mjs";
import { createTransporter, mailOptions } from '../mailer.mjs'
//endregion
const transporter = createTransporter();

function handleIncomingMessage({ bot, chatId, message, firstName, reply_to_message }) {
  // Check if user is rate limited
  if (isRateLimited(chatId)) {
    bot.sendMessage(chatId, "You are sending too many requests. Please try again later.");
    return;
  }
  console.log('messageIdsMap', message);
  const messageId = messageIdsMap.get(chatId);


  let isMessageIdMatched = messageId === reply_to_message?.message_id;
  switch (true) {
    case /^\/start/i.test(message):
      handleFirstVisit({ bot, chatId, firstName });
      break;
    case isMessageIdMatched:
      handleSayGoodbyeSoon(bot, chatId);
      break;
    default:
      handleUnknownMessage(bot, chatId);
      break;
  }

  // saveMessageToDatabase({ chatId, message, firstName });
}

async function handleCallbackQuery(
  bot,
  {
    data,
    message: {
      chat: { id: chatId }
    }
  }
) {
  if (data === CALLBACK_EVENTS.book_activity_registration) {
    bot.sendMessage(chatId, `Виберіть:`, {
      reply_markup: {
        one_time_keyboard: true,
        inline_keyboard: [
          [
            { text: "Реєстрація Spolka z O.O.", url: process.env.GOOGLE_FORM_URL },
            { text: "Реєстрація JDG", url: process.env.GOOGLE__SUB_FORM_URL } // First button on first row
          ]
        ]
      }
    });
  }

  if (data === CALLBACK_EVENTS.request_legalization) {
    bot.sendMessage(chatId, `Виберіть:`, {
      reply_markup: {
        one_time_keyboard: true,
        inline_keyboard: [
          [
            { text: "Карта побиту з PESEL UKR", callback_data: CALLBACK_EVENTS.ask_base_information },
            { text: "Карта побиту", callback_data: CALLBACK_EVENTS.ask_base_information } // First button on first row
          ],
          [
            { text: "Карта резидента", callback_data: CALLBACK_EVENTS.ask_base_information },
            { text: "Карта поляка", callback_data: CALLBACK_EVENTS.ask_base_information } // First button on first row
          ]
        ]
      }
    });

    // const { message_id } = bot.sendMessage(
    //   message.chat.id,
    //   "Підкажіть, будь ласка, ваше ім'я? Це необхідно для розуміння як до вас звертатися",
    //   {
    //     reply_markup: {
    //       force_reply: true
    //     }
    //   }
    // );
    // chatState[message.chat.id] = ASKING_FOR_USER_NAME;
  }

  if (data === CALLBACK_EVENTS.ask_base_information) {
    const { message_id, ...rest } = await bot.sendMessage(
      chatId,
      "Підкажіть, будь ласка, ваше ім'я та контактний номер телефон?",
      {
        reply_markup: {
          force_reply: true
        }
      }
    );

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          bot.sendMessage(chatId, 'Failed to send email');
      } else {
          console.log('Email sent: ' + info.response);
          bot.sendMessage(chatId, 'Email sent successfully');
      }
  });
    messageIdsMap.set(chatId, message_id);
  }
}

function handleFirstVisit({ bot, chatId, firstName }) {
  bot.sendMessage(
    chatId,
    `Привіт 🙋‍♀️Тебе вітає Legal Expert-бот. 
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

function sendMessageWithAskBaseInformation(chatId, optionNumber) {
  var options = {
      reply_markup: JSON.stringify({
      inline_keyboard: [
          [{ text: `Sub-option ${optionNumber}.1`, callback_data: `${optionNumber}_1` }],
          [{ text: `Sub-option ${optionNumber}.2`, callback_data: `${optionNumber}_2` }]
      ]
      })
  };
  bot.sendMessage(chatId, `Дякуємо ми зв'яжемося з вами щодо вашого питання найближчим часом.`, options);
}
function handleSayGoodbyeSoon(bot, chatId) {
  bot.sendMessage(chatId, "Дякуємо ми зв'яжемося з вами щодо вашого питання найближчим часом.");
}


function handleReturningUser(bot, chatId) {
  bot.sendMessage(chatId, "Welcome back!");
}

export { handleIncomingMessage, handleCallbackQuery, handleFirstVisit };
