const express = require('express');
const Customer = require('../models/customerAuth');
const Booking = require('.../models/booking');

const app = express.Router();


function generateOTP(length = 6) {
    const chars = '0123456789'; // characters from which OTP will be generated
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }
    return otp;
  }

// ***************************************Customers*****************************************

app.post('/customer/signup', async (req, res) => {
    try {
      const { name, contact, email, password} = req.body;

      // Check if email or contact already exists in the database
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { contact }] });
    if (existingCustomer) {
      return res.status(409).json({ success: false, message: 'Email or contact already exists.' });
    }

      const otp = generateOTP(); // Generate a 6-digit OTP

      // Send OTP via Twilio
      // await sendOtpViaTwilio(contact, otp);
  
      // Create a new partner document with signup data and OTP
      console.log(otp)
      const customer = new Customer({ name, contact, email, password, otp });
      await customer.save();
  
      res.json({ success: true, message: 'OTP sent for verification.' });
    } catch (err) {
      console.log(err)
      res.status(500).json({ success: false, message: 'Error signing up.' });
    }
  });
  app.post('/customer/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if a customer with the provided email exists in the database
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // Compare the provided password with the hashed password in the database
      if (password !== customer.password) {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
      }
      const otp = generateOTP(); // Generate a 6-digit OTP
      customer.otp = otp;
      await customer.save();
  
      // Password is correct, create a session or token to authenticate the user (not shown in this example)
      // You can use JSON Web Tokens (JWT) or a session-based approach for authentication.
  
      res.json({ success: true, message: 'User signed in successfully.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error signing in.' });
    }
  });

  app.post('/customer/verify/otp', async (req, res) => {
    try {
      const { id, enteredOTP } = req.body;
      console.log(enteredOTP)
      // Find the partner based on the ID
      const customer = await Customer.findById(id);
  
      // Check if the partner is not found in the database
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found.' });
      }
  
      // Check if the entered OTP matches the one in the document
      if (customer.otp !== enteredOTP) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }
  
      // OTP is valid, send success response
      res.json({ success: true, message: 'OTP verification successful.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error verifying OTP.' });
    }
  });

  app.get('/customer', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json({ success: true, customers });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching customers.' });
    }
  });

  
  // Get service history for a customer by customerId
  router.get('/customers/:customerId/service-history', async (req, res) => {
    try {
      const { customerId } = req.params;
  
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // Find service requests associated with the customer
      const serviceHistory = await Booking.find({ customer: customerId }).populate('subService');
  
      res.json(serviceHistory);
    } catch (err) {
      res.status(500).json({ error: 'Unable to fetch service history.' });
    }
  });
  



  


  module.exports = app;