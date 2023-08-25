const express = require('express');
const Customer = require('../../models/customerAuth');
const Booking = require('../../models/booking');

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
      otpMap.set(email, { otp, expiresAt: moment().add(5, 'minutes') });
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
      const { email, enteredOTP } = req.body;
      
    const storedOTPInfo = otpMap.get(email);

    console.log('Stored OTP Info:', storedOTPInfo);
    if (!storedOTPInfo) {
        res.status(404).json({ message: 'OTP not found. Please generate a new OTP.' });
        return;
    }

    if (moment().isAfter(storedOTPInfo.expiresAt)) {
        otpMap.delete(email);
        res.status(400).json({ message: 'OTP expired. Please generate a new OTP.' });
        return;
    }

    if (String(enteredOTP) === String(storedOTPInfo.otp)) {
        otpMap.delete(contact);
        res.status(200).json({ message: 'OTP verification successful.' });
    } else {
        res.status(401).json({ message: 'Invalid OTP.' });
    }
      // OTP is valid, send success response
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error verifying OTP.' });
    }
  });

  


  

  


  module.exports = app;