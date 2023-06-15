const EVENTS = {
  MESSAGE: "message",
  CALLBACK_QUERY: "callback_query"
};

const CALLBACK_EVENTS = {
  book_activity_registration: "book_activity_registration",
  request_legalization: "request_legalization",
  ask_base_information: "ask_base_information"
};

const chatState = {}; // state for each chat

export { EVENTS, CALLBACK_EVENTS, chatState };
