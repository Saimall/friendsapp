const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Razorpay = require('razorpay'); // Import Razorpay library
const Customer = require('../models/customerAuth');
const Service = require('../models/service');

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


  //updating customerreview
  router.put('/service-requests/:requestId/customer-updatereview', async (req, res) => {
    try {
      const { requestId } = req.params;
      const { customerId, review } = req.body;
  
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // Find the service request by ID
      const bookingrequest= await Booking.findById(requestId);
      if (!bookingrequest) {
        return res.status(404).json({ error: 'Service request not found.' });
      }
  
      // Check if the service request is associated with the customer
      if (Booking.customer.toString() !== customerId) {
        return res.status(403).json({ error: 'Unauthorized to update review for this service request.' });
      }
  
      // Update the review
      Booking.customerreview = review;
      await Booking.save();
  
      res.status(200).json(bookingrequest);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update review.' });
    }
  });

//updating partner review
  router.put('/service-requests/:requestId/partner-updatereview', async (req, res) => {
    try {
      const { requestId } = req.params;
      const { customerId, review } = req.body;
  
      // Find the customer by ID
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }
  
      // Find the service request by ID
      const bookingrequest= await Booking.findById(requestId);
      if (!bookingrequest) {
        return res.status(404).json({ error: 'Service request not found.' });
      }
  
      // Check if the service request is associated with the customer
      if (Booking.customer.toString() !== customerId) {
        return res.status(403).json({ error: 'Unauthorized to update review for this service request.' });
      }
  
      // Update the review
      Booking.partnerreview = review;
      await Booking.save();
  
      res.status(200).json(bookingrequest);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update review.' });
    }
  });


  //get booked service by serviceId

  router.get('/bookedservice/:serviceid',async(request,response)=>{

    const serviceid = request.params.serviceid;

    const  service = Service.findById(serviceid);
    if(!service){
        return response.status(404).json({message:"errror occured"});

    }
    return res.status(200).json(service);

  });

  router.get('/bookingslist/:partnerid',async(request,response)=>{

    const partnerid = requet.params.partnerid;

    if(!partnerid){
      return response.status(400).response({message:"invalid partner"})
    }


  })


module.exports = router;