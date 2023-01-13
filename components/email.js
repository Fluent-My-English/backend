var nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()

var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

module.exports = transporter;