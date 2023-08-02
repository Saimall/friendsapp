const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Create a new address for a customer
router.post('/customers/:customerId/addresses', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { fullname, Phonenumber, Pincode, House, City,Addresstype} = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $push: {
          addresses: {
            fullname,
            Phonenumber,
            Pincode,
            House,
            City,
            Addresstype
          },
        },
      },
      { new: true }
    );

    res.status(201).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Unable to add address.' });
  }
});

// Get all addresses for a customer
router.get('/customers/:customerId/addresses', async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.json(customer.addresses);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch addresses.' });
  }
});

// Update an address for a customer
router.put('/customers/:customerId/addresses/:addressId', async (req, res) => {
  try {
    const { customerId, addressId } = req.params;
    const { name, contact, pincode, location, typeOfLocation } = req.body;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: customerId, 'addresses._id': addressId },
      {
        $set: {
          'addresses.$.fullname': fullname,
          'addresses.$.Phonenumber': Phonenumber,
          'addresses.$.Pincode': Pincode,
          'addresses.$.House': House,
          'addresses.$.City': City,
          'addresses.$.Addresstype':Addresstype,
        },
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update address.' });
  }
});

// Delete an address for a customer
router.delete('/customers/:customerId/addresses/:addressId', async (req, res) => {
  try {
    const { customerId, addressId } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $pull: { addresses: { _id: addressId } },
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete address.' });
  }
});

module.exports = router;