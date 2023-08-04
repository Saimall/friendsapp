const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
    unique: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false,
  },
  customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
  }
  
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;