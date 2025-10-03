// services/mailer.js
const nodemailer = require('nodemailer');

// Create transporter with better error handling and timeout settings for cloud deployment
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use service instead of host for better cloud compatibility
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Add timeout and connection settings for cloud environments
  connectionTimeout: 120000, // 120 seconds
  greetingTimeout: 120000,   // 120 seconds
  socketTimeout: 120000,     // 120 seconds
  // Add retry and pooling for better reliability
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 5
});

// Add connection verification on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

async function sendMail({ from = process.env.FROM_EMAIL, to, subject, text, html }) {
  try {
    const mailOptions = { from, to, subject, text, html };
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Mail error:', error);
    throw error;
  }
}

module.exports = { sendMail };
