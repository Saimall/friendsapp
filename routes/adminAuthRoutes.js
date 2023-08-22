

// adminAuth.js (routes/adminAuth.js)
const express = require('express');
const bcrypt = require('bcrypt');




const Admin=require('../models/adminAuth');
const Partner=require('../models/partnerAutth');
const City=require('../models/city');
const Customer = require('../models/customerAuth');
const Booking = require('../models/booking');
const Review = require('../models/review');
const Service = require('../models/service');


const app = express.Router();



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management
 * components:
 *   requestBodies:
 *     AdminSignup:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: password123
 * 
 * /admin/signup:
 *   post:
 *     summary: Sign up a new admin
 *     tags: [Admin]
 *     requestBody:
 *       $ref: '#/components/requestBodies/AdminSignup'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin ID already exists
 *       500:
 *         description: Internal server error
 */


app.post('/admin/signup', async (req, res) => {
  try {
    const { adminId, password } = req.body;

    // Check if adminId already exists
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin ID already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin object
    const newAdmin = new Admin({
      adminId,
      password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management
 * 
 * /admin/admins:
 *   get:
 *     summary: Admin Details
 *     tags: [Admin]
 *     responses:
 *       201:
 *         description: Admin details fetched successfully
 *       400:
 *         description: Admin ID Invalid
 *       500:
 *         description: Internal server error
 */
app.get('/admin/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// adminAuth.js (routes/adminAuth.js)
// ... (previous code)


/**
 * @swagger
 * /admin/update-password/{adminId}:
 *   put:
 *     summary: Update admin's password
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the admin to update the password for
 *       - in: body
 *         name: passwordUpdate
 *         required: true
 *         description: Old and new passwords for updating
 *         schema:
 *           type: object
 *           properties:
 *             oldPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Invalid old password
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

app.put('/admin/update-password/:adminId', async (req, res) => {
    try {
      const { adminId } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      // Find the admin by adminId
      const admin = await Admin.findOne({ adminId: adminId });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Check if the old password is correct
      const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password
      admin.password = hashedNewPassword;
      await admin.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // adminAuth.js (routes/adminAuth.js)
// ... (previous code)

app.delete('/admin/delete-account/:adminId', async (req, res) => {
    try {
      const { adminId } = req.params;
  
      // Find the admin by adminId
      const admin = await Admin.findOne({ adminId });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Delete the admin account
      await Admin.deleteOne({ adminId });
  
      res.status(200).json({ message: 'Admin account deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
  // adminAuth.js (routes/adminAuth.js)
// ... (previous code)

app.post('/admin/signin', async (req, res) => {
    try {
      const { adminId, password } = req.body;
  
      // Find the admin by adminId
      const admin = await Admin.findOne({adminId});
      if (!admin) {
        return res.status(401).json({ message: 'Invalid admin ID' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid  password' });
      }
  
      // If the adminId and password are valid, consider it a successful sign-in
      res.status(200).json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//done verification of routes till this
//get partners details 
//successed
  app.get('/admin/admins/partnersdetails',async(request,response)=>{
  
    const partners = await Partner.find({status:'Verified'});
    console.log(partners);
    if(!partners){
      return response.status(401).json({message:"invalid partner"});
    }
    else{
      return response.status(200).json(partners);
    }


  })



  // getting each partner details
  //sucess
app.get('/admins/:partnerid/partnersprofile',async(request,response)=>{
  
  const partnerid = request.params.partnerid;
//calling asysnc function
(async () => {
  try {
    const partner = await Partner.findById(partnerid);
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
 const citylist = City.find() //retriveing all cities
const customer = Customer.findOne(customerid); 
 if(!customer){
  return response.status(402).json({message:"invalid customer requesting city"});
 }
 else{
     
     return response.json(citylist);
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
      const Completedgpartners = await Partner.find({partnerworkstatus:"Completed"});

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
           const service = Service.findOne(serviceid);
          service_name[i]=service.name;
          let customerid = list_review[i].customer;
           const customer = Service.findOne(customerid);
          customer_object[i]=customer;  
     }
     return response.json({review,service_name,customer_object});
})

//getting avaliable booking requets

app.get("/bookingrequests",async(request,response)=>{
 
  const Bookinglist = Booking.find() //getting list of Booking

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

    const partners = Partner.find();
    let avaliable_partners=[];

    for(let i=0;i<partners.length;i++){

      if(partners[i].partnerworkstatus == "Completed"){
        avaliable_partners.push(partners[i]);
      }
   return response.status(200).json({avaliable_partners});
    }

//assigning service to the partners
  app.post("/assignservice/partners/:serviceid/:partnerid",async(request,response)=>{
        const {serviceid,partnerid}= request.params

        const partner = Partner.findOne(partnerid);
        if(!partner){
          return response.status(401).json({message:"invalid partner"});
        }
        else{
          partner.serviceassigned.push(...serviceid);
          return response.status(200).json({message:'successfully assigned'});
        }
  })

  //get customers

  app.get("/cutomersavaliable",async(request,response)=>{

     const customer = Customer.find(); //getting list of customers

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
  const admin = await Admin.findOne({ username: email }); // Replace "admin_username" with the actual username

  if (!admin) {
    return response.status(404).json({ message: "Admin not found" });
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
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email:email }, // The unique identifier to find the admin
      { $set: { fullname: fullname, email: email } }, // The new data you want to update
      { new: true } // Return the updated document
    );

    if (!updatedAdmin) {
      return response.status(404).json({ message: "Admin not found" });
    }

    response.status(200).json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin profile:', error);
    response.status(500).json({ message: "Server error" });
  }
});

});



   



  
  module.exports = app;
  