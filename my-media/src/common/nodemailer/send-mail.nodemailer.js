import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USER } from "../constant/app.constant";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Anh Long Anh Long 👻" <khai.tran.srp@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default sendMail;
