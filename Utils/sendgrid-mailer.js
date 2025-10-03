// Alternative mailer using SendGrid (more reliable for cloud deployment)
const sgMail = require('@sendgrid/mail');

// Set up SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendMailWithSendGrid({ from = process.env.FROM_EMAIL, to, subject, text, html }) {
  try {
    const msg = {
      to,
      from,
      subject,
      text,
      html
    };

    const result = await sgMail.send(msg);
    console.log('Email sent via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
}

module.exports = { sendMailWithSendGrid };