const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  subServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubService',
    required: true,
  },
  review:{
    type:String,
    required:false
  },
  address: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  bookingStatus:{
    type:String,
    enum:['assigned','completed'],
    default:'Requested'
  },
  order: {
    type: String, // Store the Razorpay order ID
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;