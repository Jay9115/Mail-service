// services/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail({ from = process.env.FROM_EMAIL, to, subject, text, html }) {
  const mailOptions = { from, to, subject, text, html };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
