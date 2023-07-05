import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD
    }
  });
};
let mailOptions = {
  from: process.env.EMAIL_ADDRESS,
  to: process.env.EMAIL_ADDRESS,
  subject: "Hello from Telegram Bot",
  text: "Hello world?"
};

export { createTransporter, mailOptions };
