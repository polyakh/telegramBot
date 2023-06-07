
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

export { isRateLimited };
