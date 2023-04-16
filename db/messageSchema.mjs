const messageSchema = {
    type: "object",
    properties: {
      _id: { type: "string" },
      chatId: { type: "number" },
      message: { type: "string" },
      firstName: { type: "string" },
      timestamp: { type: "string" }
    }
  };

export { messageSchema };