

const express = require('express');
const Customer = require('../../models/customerAuth');



const app = express.Router();














app.get('/customer', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json({ success: true, customers });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching customers.' });
    }
  });

  
  // Get service history for a customer by customerId
  app.get('/customers/:customerId/service-history', async (req, res) => {
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
  