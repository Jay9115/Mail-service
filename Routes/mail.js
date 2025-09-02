// routes/mail.js
const express = require('express');
const router = express.Router();
const validator = require('validator');
const requireApiKey = require('../middleware/apiKey');
const { sendMail } = require('../Utils/mailer');
// const MailLog = require('../models/MailLog');
router.use(requireApiKey);
// This endpoint sends custom email(s). Add authentication in production.
router.post('/send-custom', async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body;

    if (!to) return res.status(400).json({ error: '"to" is required' });
    const toList = Array.isArray(to) ? to : [to];
    for (const t of toList) {
      if (!validator.isEmail(t)) return res.status(400).json({ error: `Invalid recipient: ${t}` });
    }
    try {
      const info = await sendMail({
        from: from || process.env.FROM_EMAIL,
        to: toList.join(','),
        subject: subject || '(no subject)',
        text: text || (html ? '' : '(no content)'),
        html: html || undefined
      });
  // MailLog removed
      return res.json({ ok: true, message: 'Email sent' });
    } catch (err) {
  // MailLog removed
      console.error('Send custom mail error', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
