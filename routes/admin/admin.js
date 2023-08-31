
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const Admin=require('../../models/adminAuth');
const Partner=require('../../models/partnerAutth');
const City=require('../../models/city');
const Customer = require('../../models/customerAuth');
const Booking = require('../../models/booking');
const Review = require('../../models/review');
const Service = require('../../models/service');


const app = express.Router();


 // getting each partner details
  //sucess
  app.get('/admins/:partnerid/partnersprofile',async(request,response)=>{
  
    const partnerid = request.params.partnerid;
  //calling asysnc function
  (async () => {
    try {
      const partner = await Partner.findOne({ _id: new ObjectId(partnerid) });
      if (partner) {
        // 'partner' will be the document that matches the provided ID
        return response.status(200).json(partner);
      } else {
        // If partner is null, the document with the provided ID was not found
        console.log('Partner not found.');
      }
    } catch (err) {
      // Handle the error (e.g., database error)
      console.error(err);
    }
  })();
  
  });
  
  
  
  
  //getting all cities
  
  app.get("/cities/:customerid",async(request,response)=>{
  
   const customerid = request.params.customerid;
   const citylist = await City.find() //retriveing all cities
  const customer = await Customer.findOne({ _id: new ObjectId(customerid) }); 
   if(!customer){
    return response.status(402).json({message:"invalid customer requesting city"});
   }
   else{
       
       return response.status(200).json(citylist);
   }
  })
  
  //geting partners work status
  //successed
  app.get("/ongoingstatus/partners",async(request,response)=>{
    
    (async () => {
      try {
        const Ongoingpartners = await Partner.find({partnerworkstatus:"Ongoing"});
  
        if (Ongoingpartners) {
          // 'partner' will be the document that matches the provided ID
          return response.status(200).json(Ongoingpartners);
        } else {
          // If partner is null, the document with the provided ID was not found
          return response.status(420).json({message:"partner not found"});
        }
      } catch (err) {
        // Handle the error (e.g., database error)
        console.error(err);
      }
    })();
  });
  //successed
  app.get("/Completedstatus/partners",async(request,response)=>{
    
    (async () => {
      try {
        const Completedpartners = await Partner.find({partnerworkstatus:"Completed"});
  
        if (Completedpartners) {
          // 'partner' will be the document that matches the provided ID
          return response.status(200).json(Completedpartners);
        } else {
          // If partner is null, the document with the provided ID was not found
          return response.status(420).json({message:"partner not found"});
        }
      } catch (err) {
        // Handle the error (e.g., database error)
        console.error(err);
      }
    })();
  });
  //succssed
  app.get("/Upcomingstatus/partners",async(request,response)=>{
    (async () => {
      try {
        const Upcomingpartners = await Partner.find({partnerworkstatus:"Upcoming"});
  
        if (Upcomingpartners) {
          // 'partner' will be the document that matches the provided ID
          return response.status(200).json(Upcomingpartners);
        } else {
          // If partner is null, the document with the provided ID was not found
          return response.status(420).json({message:"partner not found"});
        }
      } catch (err) {
        // Handle the error (e.g., database error)
        console.error(err);
      }
    })();
    
  });
  
  //customer review
  
  app.get("/customerreview",async(request,response)=>{
  
     const list_review = await Review.find();
     let service_name=[];
     let customer_object=[];
     let review=[];
       for(let i=0;i<list_review.length;i++){
          review[i] = list_review[i].review;
             let serviceid = list_review[i].service;
             const service = await Service.findOne({ _id: new ObjectId(serviceid) });
            service_name[i]=service.name;
            let customerid = list_review[i].customer;
             const customer = await Service.findOne({ _id: new ObjectId(customerid) });
            customer_object[i]=customer;  
       }
       return response.json({review,service_name,customer_object});
  })
  
  //getting avaliable booking requets
  
  app.get("/bookingrequests",async(request,response)=>{
   
    const Bookinglist = await Booking.find() //getting list of Booking
  
    let assigned_booking=[];
    let requested_booking=[];
    let completed_booking=[];
    for(let i=0;i<Bookinglist.length;i++){
  
      if(Bookinglist[i]. bookingStatus == "assigned"){
        assigned_booking.push(Bookinglist[i]);
      }
      else if(Bookinglist[i]. bookingStatus == "completed"){
        completed_booking.push(Bookinglist[i]);
      }
      else{
        requested_booking.push(Bookinglist[i]);
      }
  }
  
  return response.json({assigned_booking,requested_booking,completed_booking});
  
  })
  
  
  //getting avaliables partners 
  
  app.get("/partners/avaliable",async(request,response)=>{
  
      const partners = await Partner.find();
      let avaliable_partners=[];
  
      for(let i=0;i<partners.length;i++){
  
        if(partners[i].partnerworkstatus == "Completed"){
          avaliable_partners.push(partners[i]);
        }
     return response.status(200).json({avaliable_partners});
      }
    });
  
  //assigning service to the partners
    app.post("/assignservice/partners/:serviceid/:partnerid",async(request,response)=>{
          const {serviceid,partnerid}= request.params
  
          const partner = await Partner.findOne({ _id: new ObjectId(partnerid) });
          if(!partner){
            return response.status(401).json({message:"invalid partner"});
          }
          else{
            partner.serviceassigned.push(serviceid);
            await partner.save();
            return response.status(200).json({message:'successfully assigned'});
          }
    })
  
    //get customers
  
    app.get("/cutomersavaliable",async(request,response)=>{
  
       const customer = await Customer.find(); //getting list of customers
  
       if(customer.length ==0){
        return response.status(402).json({message:"empty customers"});
       }
       else{
        return response.status(200).json(customer);
       }
    });
  
    //edit profile 
  
   
  app.put("/admineditprofile", async (request, response) => {
    const { fullname, email } = request.body;
  
    // Find the admin by the unique identifier (e.g., username)
    const admin = await Admin.findOne({ username: email }); 
    if (!admin) {
      return response.status(404).json({ message: "Admin not found" });
    }
  
    // Check if the entered name  email are the same as the current admin's name and email
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
      const updatedAdmin = await Admin.findOneAndUpdate(
        { email:email }, // The unique identifier to find the admin
        { $set: { fullname: fullname, email: email } }, // The new data you want to update
        { new: true } // Return the updated document
      );
           
      if (!updatedAdmin) {
        return response.status(404).json({ message: "Admin not found" });
      }
       await updatedAdmin.save();
      return response.status(200).json(updatedAdmin);
    } catch (error) {
      console.error('Error updating admin profile:', error);
      return response.status(500).json({ message: "Server error" });
    }
  });
  

  
  
  
     
  
  
  
    
    module.exports = app;