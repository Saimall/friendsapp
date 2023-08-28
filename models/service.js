const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: { type: String, enum: ['Daily', 'Monthly'], },
  image:{
    type:String,
  }
  
  // cities: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'City',
  //   required: false,
  // }],
  // price: {
  //   type: Number,
  //   required: true,
  // },
  // date: {
  //   type: Date,
  //   default: Date.now,
  // },

  // status: {
  //   type: String,
  //   enum: ['Pending', 'Started', 'Completed'],
  //   default: 'Pending',
  // },

  // partner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Partner',
  //   required: true,
  // },
  // customer: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Customer',
  //   required: true,
  // },
  
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
