const userRequests = {};

function isRateLimited(userId) {
  const now = Date.now();
  const interval = 1000 * 60; // 1 minute interval
  const requests = userRequests[userId] || [];
  const recentRequests = requests.filter((timestamp) => now - timestamp < interval);
  if (recentRequests.length >= 10) {
    // allow up to 10 requests per minute
    return true;
  }
  userRequests[userId] = [...recentRequests, now];
  return false;
}

function createKeyboard(options) {
  return {
    keyboard: options.map(({ text }) => [{ text }]),
    resize_keyboard: true,
    one_time_keyboard: true,
    selective: true
  };
}

const options = [
  { text: "Записатися на консультацію" },
  { text: "Легалізація" },
  { text: "Запис на реєстрацію діяльності" }
];

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

export { isRateLimited, handleFirstVisit };
