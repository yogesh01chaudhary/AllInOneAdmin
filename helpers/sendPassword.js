"use strict";
const nodemailer = require("nodemailer");

exports.sendMail = async (fName, receiver, password) => {
  try {
    let transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      port: process.env.PORTMAIL,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.USER,
      //   to: "yogesh01chaudhary@gmail.com",
      to: receiver,
      subject: "Request Status",
      text: `Hello world? your password is ${password}`,
      html: password
        ? `Hi ${fName} your request is accepted, Please usethese login credentials to login:- user id is ${receiver} and password is ${password}`
        : `Hi ${fName} your request is rejected`,
    });
    let message = ` Message sent Please check the status of your request in your mailbox:, ${JSON.stringify(
      info
    )}`;
    console.log(message);
    return message;
  } catch (e) {
    console.log("error", e);
    return {
      message: "Message not sent something went wrong in nodemailer: %s",
      e,
    };
  }
};

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const integers = "0123456789";
const exCharacters = "!@#$%^&*_-=+";
exports.createPassword = (length, hasNumbers, hasSymbols) => {
  let chars = alpha;
  if (hasNumbers) {
    chars += integers;
  }
  if (hasSymbols) {
    chars += exCharacters;
  }
  return generatePassword(length, chars);
};

const generatePassword = (length, chars) => {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
