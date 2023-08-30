const express = require('express');
const Partner = require('../../models/partnerAutth');
const session = require("express-session");
const Booking = require('../../models/booking');
const Service = require('../../models/service');
const subService = require('../../models/subService');
const bcrypt = require('bcrypt');
const app = express.Router();

const partnerService = require('../../models/partnerServices');




  
  
  //get partner service city
  app.get('/partners/:partnerId/city', async (req, res) => {
    try {
      const { partnerId } = req.params;
  
      // Find the partner by ID
      const partner = await Partner.findById(partnerId);
      if (!partner) {
        return res.status(404).json({ error: 'Partner not found.' });
      } 
  
      // Get the list of cities where the partner provides services
      const serviceCities = partner.city;
  
      return res.json(serviceCities);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to fetch partner service cities.' });
    }
  });
  
  // Endpoint to update partner's online/offline status
  app.put('/partner/:partnerId/status', async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { status } = req.body; // 'online' or 'offline'
  
      // Find the partner by ID
      const partner = await Partner.findById(partnerId);
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found.' });
      }
  
      // Update the partner's status
      partner.onlineStatus = status;
  
      // Save the updated partner
      await partner.save();
  
      return res.json({ success: true, message: `Partner is now ${status}.` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error updating partner status.' });
    }
  });
  
  
  // Endpoint to get partners with 'Ongoing' work status
  app.get('/partners/ongoing', async (req, res) => {
    try {
      const ongoingPartners = await Partner.find({ partnerworkstatus: 'Ongoing' });
      return res.json({ success: true, partners: ongoingPartners });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error fetching partners with ongoing work status.' });
    }
  });
  
  // Endpoint to get partners with 'Upcoming' work status
  app.get('/partners/upcoming', async (req, res) => {
    try {
      const upcomingPartners = await Partner.find({ partnerworkstatus: 'Upcoming' });
      return res.json({ success: true, partners: upcomingPartners });
    } catch (err) {
      console.error(err);
     return res.status(500).json({ success: false, message: 'Error fetching partners with upcoming work status.' });
    }
  });
  
  // Endpoint to get partners with 'Completed' work status
  app.get('/partners/completed', async (req, res) => {
    try {
      const completedPartners = await Partner.find({ partnerworkstatus: 'Completed' });
      return res.json({ success: true, partners: completedPartners });
    } catch (err) {
      console.error(err);
     return res.status(500).json({ success: false, message: 'Error fetching partners with completed work status.' });
    }
  });
  
  
  // Calculate total earnings for a date
  
  app.get('/total-earnings/day/:date', async (req, res) => {
    try {
      const date = new Date(req.params.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
  
      const totalEarnings = await Service.aggregate([
        {
          $match: {
            date: {
              $gte: date,
              $lt: nextDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' },
          },
        },
      ]);
  
      return res.status(200).json({ totalEarnings: totalEarnings[0]?.total || 0 });
    } catch (error) {
      console.error('Error calculating total earnings:', error);
     return  res.status(500).json({ message: 'Server error' });
    }
  });
  
  //calculating total earning in month
  app.get('/total-earnings/month/:year/:month', async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
  
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
  
      const totalEarnings = await Service.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$price' },
          },
        },
      ]);
  
      return res.json({ totalEarnings: totalEarnings[0]?.total || 0 });
    } catch (error) {
      console.error('Error calculating total earnings:', error);
     return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Can mark a  status either started and completed U
  app.put('/services/:serviceId/status', async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { status } = req.body;
  
      // Check if the provided status is valid
      if (!['Started', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
      }
  
      // Find the service by ID and update the status
      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        { status: status },
        { new: true } // Return the updated document
      );
  
      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found' });
      }
       await Service.save();
      return res.json(updatedService);
    } catch (error) {
      console.error('Error updating service status:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  // Get completed service history for a partner
  app.get('/partners/:partnerId/completed-services', async (req, res) => {
    try {
      const { partnerId } = req.params;
  
      // Find the partner by ID
      const partner = await Partner.findById(partnerId);
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  
      // Find all completed services for the partner
      const completedServices = await Service.find({
        partner: partnerId,
        status: 'Completed',
      }).populate('customer', 'fullname'); // Populate customer data with fullname
  
      res.json(completedServices);
    } catch (error) {
      console.error('Error fetching completed services:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update a booking by adding stars based on booking ID
  app.put('/partnerratingbookings/:bookingId', async (req, res) => {
    try {
      const { bookingId } = req.params;
      const {partnerreviewriting,partnerrating}=req.body;
  
      // Find the booking by ID and update its fields
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        partnerreviewriting, 
        { new: true } // Return the updated document
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
     await Booking.save();
      res.json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //customerrating 
  app.put('/customerratingbookings/:bookingId', async (req, res) => {
    try {
      const { bookingId } = req.params;
      const {customerrreviewriting, customerrating}=req.body;
  
      // Find the booking by ID and update its fields
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        customerrreviewriting, 
        { new: true } // Return the updated document
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      await Booking.save();
      res.json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //Get Review’s Given to Customer and Got by CUstomer
  app.get("/booking",async(request,response)=>{
  
    bookingslist = await Booking.find() //getting all reviews
  
   if(bookingslist.length == 0 ){
    return response.status(403).json({message:"empty bokkings"});
   }
   else{
       return response.status(200).json(bookingslist);
   }
  })
  
  
  //partner crud operations
  
  //updating
  app.put("/partnerditprofile/:partnerid", async (request, response) => {
  
    const partnerid = request.params.partnerid;
  
    const { fullname, email } = request.body;
  
  
    if(!partnerid){
      return response.status(403).json({message:"invalid id"});
    }
    const partner = await Partner.findOne(partnerid);
    if(partner){
      return response.status(403).json({message:"invalid partner"});
    }
  
  
    // Check if the entered name and email are the same as the current admin's name and email
    if (fullname === admin.fullname && email === admin.email) {
      return response.status(420).json({ message: "Entered name and email are the same" });
    }
  
    if (!fullname || fullname.trim() === "") {
      return response.status(420).json({ message: "Fullname cannot be null or empty" });
    }
  
    if (!email || email.trim() === "") {
      return response.status(420).json({ message: "Email cannot be null or empty" });
    }
  
    // Perform the update operation using findOneAndUpdate
    try {
      const updatedpartner = await Partner.findOneAndUpdate(
        { partnerid }, // The unique identifier to find the admin
        { $set: { fullname: fullname, email: email } }, // The new data you want to update
        { new: true } // Return the updated document
      );
  
      if (!updatedpartner) {
        return response.status(404).json({ message: "Partner not found" });
      }
      await Partner.save();
      response.status(200).json(updatedPartner);
    } catch (error) {
      console.error('Error updating Partner profile:', error);
      response.status(500).json({ message: "Server error" });
    }
  });
  //deleting the partner
  
  app.delete('/partners/:partnerId', async (req, res) => {
    try {
      const { partnerId } = req.params;
  
      // Find the partner by ID and delete it
      const deletedPartner = await Partner.findOneAndDelete({ _id: partnerId });
  
      if (!deletedPartner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  await Partner.save();
      res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
      console.error('Error deleting partner:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //myservices
  
  app.get("/partnerservices/:partnerid",async(request,response)=>{
  
    const partnerid= request.params.partnerid;
  
    const partner = await Partner.findOne(partnerid);
    const listserviceids = partner.serviceassigned;
    let list_services_montly=[];
    let list_services_daily=[];
    for(let i=0;i<listserviceids.length;i++){
       const service = await Service.findById(listserviceids[0]);
       if(service.type=='Monthly'){
        list_services_montly.push(service);
       }
       if(service.type=='Daily'){
        list_services_daily.push(service);
       }
    } 
    if(list_services_daily.length ==0 || list_services_montly.length ==0){
      return response.status(403).json({message:"something is wrong empty monthly and dai;y service"})
    }
    return response.status(200).json({list_services_daily,list_services_montly})
  
  });
  
  //to list services after clicking add
  app.get("/partnersservicesformodify/:partnerid",async(request,response)=>{
  
    const partnerid = request.params.partnerid;
    const partner = await Partner.findById(partnerid);
    if(!partner){
      return response.status(400).json({message:"invalid partner"});
    }
  
    const serviceidslist = partner.serviceassigned;  
    let servicelist = [];
    for(let i=0;i<serviceidslist.length;i++){
            const service = await Service.findById(serviceidslist[i]);
            servicelist.push(service);     
    }
    return response.status(200).json(servicelist);
  })
  
  
  //getting details of sub service i.e avaliable pincode .
  app.get("/partnersservicesformodify/:serviceid",async(request,response)=>{
  
    const serviceid = request.params.serviceid;
    if(!service){
      return response.status(400).json({message:"invalid partner"});
    }
    const Subservice = await subService.find({ _id:serviceid}); //getting list of sub services
  if(!Subservice){
    return response.status(420).json({message:"invalid Subservice"});
  }
   else{
    
    return response.status(200).json(Subservice);
   }
  });
  
  
  app.get("/modifyservice/:serviceid",async(request,response)=>{
  
    const serviceid = request.params.serviceid;
    
    const partnerservice = await partnerService.findById(serviceid);
  
    return response.status(200).json(partnerservice);
  
  })
  
  // app.post("/updating service",async(request,response)=>{
  
  //   const {subservice,city,servingpincodes} = request.body;
  
    
  // })


  module.exports = app;