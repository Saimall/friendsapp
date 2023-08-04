// models/partner.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  profile:{type: String,required:false},
  review:{
    type:String,
    required:false,
  },
  service: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false,
  }],
  cart: [
    {
      subService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubService', // Reference to the SubService model
        required: true,
      },
    },
  ],
  // based on address pincode - customer click on dashbboard
  //clicking on address based on pincode,city service display 
  
  address:[{
   fullname: {
      type: String,
      required:false,
      //added validations to prevent adding null values
      validate: {
        notNull: false,
        notEmpty: false,
      },
    },
    Phonenumber:{
        type:String,
        required:false,
        validate: {
          notNull: false,
          notEmpty: false,
        },
    },
    Pincode:{
      type:String,
      required:false,
      validate: {
        notNull: false,
        notEmpty: false,
      },
    },
    House:{
      type:String,
      required:false,
      validate: {
        notNull: false,
        notEmpty: false,
      },
    },
    City:{
      type:String,
      required:false,
      validate: {
        notNull: false,
        notEmpty: false,
      },
    },
    State:{
      type:String,
      type:String,
      required:false,
      validate: {
        notNull: false,
        notEmpty: false,
      },
    },
    Addresstype:{
      type:String,
      required:false,
      default:"Home",
      validate: {
        notNull: false,
        notEmpty: false,
      },

    }
  }
  ] 
  }
, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
