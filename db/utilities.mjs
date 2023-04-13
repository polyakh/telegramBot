const DATE_FORMAT = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
};

function getCurrentTimestamp(format = DATE_FORMAT) {
  return new Intl.DateTimeFormat("en-US", format).format(new Date());
}

export { getCurrentTimestamp };
