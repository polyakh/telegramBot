const EVENTS = {
  MESSAGE: "message",
  CALLBACK_QUERY: "callback_query"
};

const CALLBACK_EVENTS = {
  book_activity_registration: "book_activity_registration",
  request_legalization: "request_legalization"
};

const ASKING_FOR_USER_NAME = 'askingForUserName';

const chatState = {};  // state for each chat

export { EVENTS, CALLBACK_EVENTS, ASKING_FOR_USER_NAME, chatState };
