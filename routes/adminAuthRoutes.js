

// adminAuth.js (routes/adminAuth.js)
const express = require('express');
const bcrypt = require('bcrypt');
const Admin=require('../models/adminAuth');
const Partner=require('../models/partnerAuth');
const City=require('../models/city');
const Customer = require('../models/customerAuth');

const app = express.Router();

app.post('/signup', async (req, res) => {
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

// adminAuth.js (routes/adminAuth.js)
// ... (previous code)

app.put('/update-password/:adminId', async (req, res) => {
    try {
      const { adminId } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      // Find the admin by adminId
      const admin = await Admin.findOne({ adminId });
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

app.delete('/delete-account/:adminId', async (req, res) => {
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

app.post('/signin', async (req, res) => {
    try {
      const { adminId, password } = req.body;
  
      // Find the admin by adminId
      const admin = await Admin.findOne({ adminId });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid admin ID or password' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid admin ID or password' });
      }
  
      // If the adminId and password are valid, consider it a successful sign-in
      res.status(200).json({ message: 'Sign-in successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
app.get('/admins', async (req, res) => {
    try {
      const admins = await Admin.find();
      res.status(200).json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//get partners details 
  app.get('/admins/partnersdetails',async(request,response)=>{
  
    const partners = Partner.find({status:'Verified'});
    if(!partners){
      return response.status(401).json({message:"invalid partner"});
    }
    else{
      return response.json(200).json(partners);
    }

  })



  // getting each partner details
app.get('/admins/:partnerid/partnersprofile',async(request,response)=>{
  
  const partnerid = request.params.partnerid;
  if(!partner){
    return response.status(402).json({message:"invalid partner id"});
  }
  else{
         const partner = Partner.findOne(partnerid);
         if(!partner){
          return response.status(401).json({message:"invalid partner id"});
         }
         else{
          //sending partner object which can be accssed by frontend to attributes values to display
            return response.status(200).json(partner);
         }
  
        }
})


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
app.get("/status/partners/work",async(request,response)=>{
  
  const partners = Partner.find()//retriving all partners

  let upcoming_partners=[];
  let completed_partners=[];
  let ongoing_partners=[];

  for(let i=0;i<partners.length;i++){

      if(partners[i]. partnerworkstatus == "Ongoing"){
           ongoing_partners.push(partners[i]);
      }
      else if(partners[i]. partnerworkstatus == "Upcoming"){
        upcoming_partners.push(partners[i]);
      }
      else{
        completed_partners.push(partners[i]);
      }
  }

  return response.json({upcoming_partners,completed_partners,ongoing_partners});
})


//getting avaliable service requets


  
  module.exports = app;
  