const express = require('express');
const app = express.Router();
const OTPValidation = require('../models/otpvalidation'); // Make sure the path is correct


function generateOTP(length = 6) {
    const chars = '0123456789'; // characters from which OTP will be generated
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];  
    }
    return otp;
  }


// Route to customer request OTP
app.post('/customer/request-otp', async (req, res) => {
  const { contact } = req.body;

  try {
    const otp = generateOTP(); // You need to implement the OTP generation logic
    const newOTPEntry = new OTPValidation({ otp, contact });
    await newOTPEntry.save();

    // we can use twillo here to send generated otp ...........
    res.status(200).json({ message: 'OTP generated and sent to the provided contact.',otp});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to customer verify OTP
app.post('/customer/verify-otp', async (req, res) => {
  const { contact, otp } = req.body;

  try {
    const otpEntry = await OTPValidation.findOne({ contact,otp});

    if (otpEntry) {
      const currentTime = new Date();
      const otpExpiration = new Date(otpEntry.createdAt.getTime() + otpEntry.expiresIn);

      if (currentTime <= otpExpiration) {
        await otpEntry.deleteOne();
        res.status(200).json({ message: 'OTP verification successful' });
      } else {
        await otpEntry.deleteOne();
        res.status(400).json({ error: 'Expired OTP' });
      }
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to partner request OTP
app.post('/partner/request-otp', async (req, res) => {
    const { contact } = req.body;
  
    try {
      // Generate OTP and store in the database
      const otp = generateOTP(); // You need to implement the OTP generation logic
      const newOTPEntry = new OTPValidation({ otp, contact });
      await newOTPEntry.save();
  
      // here we can use twillo to send otp
       
      
      res.status(200).json({ message: 'OTP generated and sent to the provided contact.', otp });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to partner verify OTP
  app.post('/partner/verify-otp', async (req, res) => {
    const { contact, otp } = req.body;
  
    try {
      const otpEntry = await OTPValidation.findOne({ contact, otp });
  
      if (otpEntry) {
        const currentTime = new Date();
        const otpExpiration = new Date(otpEntry.createdAt.getTime() + otpEntry.expiresIn);
  
        if (currentTime <= otpExpiration) {
          await otpEntry.deleteOne();
          res.status(200).json({ message: 'OTP verification successful' });
        } else {
          await otpEntry.deleteOne();
          res.status(400).json({ error: 'Expired OTP' });
        }
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = app;
