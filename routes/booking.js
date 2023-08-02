const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Razorpay = require('razorpay'); // Import Razorpay library
const Customer = require('../models/customerAuth');

// POST /bookings
router.post('/bookings', async (req, res) => {
  try {
    const { customerId, subServiceId, address, bookingDate } = req.body; //handled in fornted**

    // Calculate total amount and 15% payment amount based on the selected sub-service
    // You'll need to fetch the sub-service details from your database

    // Initialize Razorpay instance
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET,
    // });

    // Create a Razorpay order
    // const order = await razorpay.orders.create({
    //   amount: 1500, // 15% payment amount in paise (for example)
    //   currency: 'INR',
    //   receipt: 'booking_receipt', // Unique receipt ID
    // });

    // Create a new booking request document
    const booking = new Booking({
      customerId,
      subServiceId,
      address,
      bookingDate,
      paymentStatus: 'Pending', // Initial payment status
      order: order.id, // Store the Razorpay order ID
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Unable to create booking request.' });
  }
});


//booking all the services in carts
router.post('/bookings-cart', async (req, res) => {
    try {
      const { customerId,cartItems , address, bookingDate } = req.body; //handled in fornted**
  
      // Calculate total amount and 15% payment amount based on the selected sub-service
      // You'll need to fetch the sub-service details from your database
  
      // Initialize Razorpay instance
      // const razorpay = new Razorpay({
      //   key_id: process.env.RAZORPAY_KEY_ID,
      //   key_secret: process.env.RAZORPAY_KEY_SECRET,
      // });
  
      // Create a Razorpay order
      // const order = await razorpay.orders.create({
      //   amount: 1500, // 15% payment amount in paise (for example)
      //   currency: 'INR',
      //   receipt: 'booking_receipt', // Unique receipt ID
      // });
  
      // Create a new booking request document
   for(const cartItem of cartItems){
    const {subServiceId} = cartItem;


      const booking = new Booking({
        customerId,
        subServiceId,
        address,
        bookingDate,
        paymentStatus: 'Pending', // Initial payment status
        order: order.id, // Store the Razorpay order ID
      });
  
      await booking.save();

     //removing book item from cart after adding 
     await Customer.findByIdUpdate(
        customerId,{
            $pull:{cart:{_id:cartItem.id}},
        }
     )

    }
      res.status(201).json({message:"cart items booked succesfully"});
    } catch (err) {
      res.status(500).json({ error: 'Unable to book cart item' });
    }
  });



module.exports = router;