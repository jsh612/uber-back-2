// import Mailgun, { messages } from "mailgun-js";

// const mailGunClient = new Mailgun({
//   apiKey: process.env.MAILGUN_API_KEY || "",
//   domain: "sandbox6dc95a40763144f59f34911bf0fb8eaf.mailgun.org"
// });

// const sendEmail = (subject: string, html: string) => {
//   const emailData: messages.SendData = {
//     from: "itnico.las.me@gmail.com",
//     to: "itnico.las.me@gmail.com",
//     subject,
//     html
//   };
//   return mailGunClient.messages().send(emailData);
// };

// export const sendVerificationEmail = (fullName: string, key: string) => {
//   const emailSubject = `Hello! ${fullName}, please verify your email`;
//   const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here</a>`;
//   return sendEmail(emailSubject, emailBody);
// };
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

const sendMail = email => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email);
  // console.log("clinet.sendMail(email);", client.sendMail(email)); // 프로미스객체 반환
  // If callback argument is not set then the method returns a Promise object.
  // https://nodemailer.com/usage/#sending-mail
};

export const sendSecretMail = (adress: string, secret: string) => {
  const email = {
    from: "seungho@prismagram.com",
    to: adress,
    subject: "🔑 Login Secret for prismagram 🔑",
    html: `안녕하세요. 당신의 로그인 secret은  <i><strong>${secret}</strong></i>  입니다.<br> 이 값을 복사하여 앱에 붙여넣기 해주세요`
  };
  return sendMail(email);
};
