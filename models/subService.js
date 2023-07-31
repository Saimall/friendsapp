const mongoose = require('mongoose');

const subServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  pincodes: [{
    type: String,
    required: false,
  }],
});

const SubService = mongoose.model('SubService', subServiceSchema);

module.exports = SubService;
