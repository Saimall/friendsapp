// models/partner.js
const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  aadharNum: { type: String },
  panNum: { type: String },
  aadhardoc: { type: String },
  pandoc: { type: String },
  otp: { type: String },
  status: { type: String, enum: ['Unverified', 'Verified', 'Denied'], default: 'Unverified' },
  date: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
}, {
  timestamps: true,
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
