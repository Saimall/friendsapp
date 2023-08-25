const express = require('express');
const app = express.Router();
const Customer = require('../models/customer');

// Update customer profile
app.put('/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, email } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: { name, email},
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

   return res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update customer profile.' });
  }
});

app.get('/customers/:customerId/editpassword',async(req,res)=>{

    const customerid = request.params.customerId;

    const customer  = Customer.findOne(customerid);
    if(!customer){
        return res.status(404).json({message:"Customer is invalid"});
    }
    return res.status(200)  
})


app.put('/customers/:customerId/editpassword', async (req, res) => {
    try {
      const { customerId } = req.params;
      const {oldpasswordcustomer,newpassword } = req.body;
      const customer = Customer.findOne(customerId);
      if(!customer){
        return res.status(404).json({ error: 'Customer not found.' });
      }
      const oldpassword = customer.password;
      const isPasswordValid = oldpassword==oldpasswordcustomer? true :false; 
      if(!isPasswordValid){
        res.status(404).json({message:"current password is incorrect"});
      }
      if(oldpassword==newpassword){
        res.status(420).json({message:"old password is same as existing password"});
      }
  
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
          $set: {password: newpassword},
        },
        { new: true }
      );
  
      res.status(200).json(updatedCustomer);
    } catch (err) {
      res.status(500).json({ error: 'Unable to edit password.' });
    }
  });


module.exports = app;