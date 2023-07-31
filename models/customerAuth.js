// models/partner.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
}, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
