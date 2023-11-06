const userAuth = require("../Models/userAuth");
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const createVerificationCode = (req, res) => {
  //Some code
};

const emailSender = async (req, res) => {
  ///recipientEmail = ""; ****************************************************************
  subject = "Email Verification";
  link =
    "https://icas.bau.edu.lb:8443/cas/login?service=https://mis.bau.edu.lb/web/v12/iconnectv12/cas/sso.aspx";
  username = "IbrahimMneimneh";
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.centralService,
      auth: {
        user: process.env.centralName,
        pass: process.env.centralPass,
      },
    });
    const templatePath = path.join(__dirname, "verifyEmail.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const mailOptions = {
      from: process.env.centralName,
      to: recipientEmail,
      subject,
      html: template({ link, subject, username }),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email: ", error);
        res.status(500).json(error);
      } else {
        res.status(200).json({ message: "Email sent successfuly" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { emailSender };
