

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

app.get('/customer', async (req, res) => {
    try {
      const customers = await Customer.find();
      return  res.json({ success: true, customers });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Error fetching customers.' });
    }
  });

  
  // Get service history for a customer by customerId
  app.get('/customers/:customerId/service-history', async (req, res) => {
    try {
      const { customerId } = req.params;
  
       console.log(customerId)
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // Find service requests associated with the customer
      const serviceHistory = await Booking.find({ customer: customerId }).populate('subService');
  
      return res.json(serviceHistory);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to fetch service history.' });
    }
  });



  module.exports = app;
  