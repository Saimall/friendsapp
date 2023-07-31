const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: false,
  }],
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
