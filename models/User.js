// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // you can add name, metadata etc.
});

module.exports = mongoose.model('User', userSchema);
