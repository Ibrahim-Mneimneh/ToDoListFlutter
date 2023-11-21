const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const emailSender = async (
  recipientEmail,
  subject,
  username,
  pin,
  filePath
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.centralService,
      auth: {
        user: process.env.centralName,
        pass: process.env.centralPass,
      },
    });
    const templatePath = path.join(__dirname, filePath);
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const mailOptions = {
      from: process.env.centralName,
      to: recipientEmail,
      subject,
      html: template({ pin, subject, username }),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw Error("Error sending email");
      }
    });
  } catch (error) {
    throw Error(error);
  }
};

module.exports = { emailSender };
