const express = require('express');
const bcrypt = require('bcrypt');




const Admin=require('../models/adminAuth');
const Partner=require('../models/partnerAutth');



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


