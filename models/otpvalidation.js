// otpvalidation.js
const mongoose = require('mongoose');

const otpValidationSchema = new mongoose.Schema({
  otp: { type: String, required: true },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
  expiresIn: { type: Number, default: 5 * 60 * 1000 } // Expiration in milliseconds (5 minutes)
});

module.exports = mongoose.model('OTPValidation', otpValidationSchema);
