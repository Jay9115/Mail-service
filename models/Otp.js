// models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otpHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  attempts: { type: Number, default: 0 }, // verification attempts
  purpose: { type: String, default: 'login' }, // label (login, reset, etc.)
  used: { type: Boolean, default: false }
});

// TTL index: documents expire OTP_TTL_SECONDS after createdAt
// set expireAfterSeconds in mongoose connection? Mongoose supports 'expires' option on Date field:
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: parseInt(process.env.OTP_TTL_SECONDS || '300') });

module.exports = mongoose.model('Otp', otpSchema);
