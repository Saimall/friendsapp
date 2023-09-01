const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: { type: String, enum: ['Daily', 'Monthly'], default:'Daily',required:true},
  price: {
    type: Number,
    required: true,
  },
  image:{
    type:String,
    required:false
  },
  cities: [{
    name: {
    type: String,
    required: true,
    unique: true,
  },
  pincodes: [
    {
    type: Number,
    required: true,
  }
],
}],

  subservices:[{
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image:{
      type:String,
      required:false
    },
}],
 
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
