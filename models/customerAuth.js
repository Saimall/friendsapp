// models/partner.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  date:{type: Date,required:false},
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
