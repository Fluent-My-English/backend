var nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config()

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "uc.chamod.public@gmail.com",
      pass: "jhqwpvtnluihkawp"
    },
  });

module.exports = transporter;