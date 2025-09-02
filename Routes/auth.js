// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const requireApiKey = require('../middleware/apiKey.js');
const User = require('../models/User');
const Otp = require('../models/Otp');
// const MailLog = require('../models/MailLog');
const { sendMail } = require('../Utils/mailer');
const { emailRateCheck } = require('../Utils/rateLimiter');

const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6');
const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS || '300');

// helper
function generateOtp(len = OTP_LENGTH) {
  const max = 10 ** len;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(len, '0');
}
router.use(requireApiKey);
// Request OTP
router.post('/request-otp', async (req, res) => {
  try {
    const { email, purpose = 'login' } = req.body;
    if (!email || !validator.isEmail(email)) return res.status(400).json({ error: 'Valid email required' });

    // rate limit per email
    const rate = emailRateCheck(email, 5, 30 * 60 * 1000);
    if (!rate.ok) {
      return res.status(429).json({ error: 'Too many requests', retryAfterMs: rate.retryAfterMs });
    }

    const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    // save OTP doc
    const otpDoc = new Otp({ email, otpHash, purpose, attempts: 0, used: false });
    await otpDoc.save();

    // send mail via nodemailer
    const subject = `Your ${purpose} code`;
    const text = `Your OTP code is ${otp}. It expires in ${Math.round(OTP_TTL_SECONDS/60)} minute(s).`;
    const html = `<p>Your OTP code is <b>${otp}</b>. It expires in ${Math.round(OTP_TTL_SECONDS/60)} minute(s).</p>`;

    try {
      const info = await sendMail({ to: email, subject, text, html });
  // MailLog removed

      return res.json({ ok: true, message: 'OTP sent' });
    } catch (mailErr) {
  // MailLog removed
      console.error('Mail error:', mailErr);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, purpose = 'login' } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    // Find the most recent unused OTP for this email & purpose
    const otpDoc = await Otp.findOne({ email, purpose, used: false }).sort({ createdAt: -1 });
    if (!otpDoc) return res.status(400).json({ error: 'No OTP requested or OTP expired' });

    // check expiry manually (TTL may delete doc soon, but double-check)
    const now = Date.now();
    if ((now - otpDoc.createdAt.getTime()) > (OTP_TTL_SECONDS * 1000)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // attempt limit
    otpDoc.attempts = (otpDoc.attempts || 0) + 1;
    if (otpDoc.attempts > 5) {
      otpDoc.used = true;
      await otpDoc.save();
      return res.status(429).json({ error: 'Too many attempts' });
    }

    const match = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!match) {
      await otpDoc.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // success: mark used
    otpDoc.used = true;
    await otpDoc.save();

    // ensure user exists & mark verified
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, verified: true });
    } else {
      user.verified = true;
      await user.save();
    }

    // optional: return jwt token (replace with your session logic)
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.json({ ok: true, message: 'Verified', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
