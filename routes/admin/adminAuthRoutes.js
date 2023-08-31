const express = require("express");
const bcrypt = require("bcrypt");

const app = express.Router();

const Admin = require("../../models/adminAuth");
const Partner = require("../../models/partnerAutth");
const City = require("../../models/city");
const Customer = require("../../models/customerAuth");
const Booking = require("../../models/booking");
const Review = require("../../models/review");
const Service = require("../../models/service");
const { ObjectId } = require("mongodb");

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

app.post("/admin/signup", async (req, res) => {
  try {
    const { name, phonenumber, email, password, role } = req.body;

    // Check if adminId already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin ID already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      phonenumber,
      email,
      password: hashedPassword,
      role,
    });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//to retrive all admins
app.get("/admin/admins", async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// adminAuth.js (routes/adminAuth.js)
// ... (previous code)

/**
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
//

//get user by role
app.get("/admin/user/:role", async (request, response) => {
  const {role} = request.params;
  let data =[]
  if(role === 'superadmin'){
    data  = await Admin.find({role: "superadmin"});
    return response.status(200).json(data);
  }
 else if(role === 'supportteam'){
    data  = await Admin.find({role: "supportteam"});
    return response.status(200).json(data);
  }
 else if(role === 'dutymanager'){
    data  = await Admin.find({role: "dutymanager"});
    return response.status(200).json(data);
  }
  else {
    data  = await Admin.find({role: "approvalteam"});
    return response.status(200).json(data);
  }
});

//updating profile

app.put("/admin/update-profile/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const {newemail, newPassword, newRole, newname,phoneNumber } = req.body;

    if (!newPassword && !newRole && !phoneNumber&& !newemail && !newname) {
      return res.status(400).json({ message: 'At least one attribute should be provided for modification' });
    }

    const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (newPassword) {
      admin.password = newPassword;
    }

    if (newRole) {
      admin.role = newRole;
    }

    if (phoneNumber) {
      admin.phonenumber = phoneNumber;
    }
    if (newemail) {
      admin.email = newemail;
    }
    if (newname) {
      admin.name = newname;
    }

    await admin.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get admin by ID
app.get("/admin/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
   
    const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



//done
app.put("/admin/update-password/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both oldPassword and newPassword are required" });
    }

    const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedNewPassword;
    await admin.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// adminAuth.js (routes/adminAuth.js)
// ... (previous code)

app.delete("/admin/delete-account/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;

    // Find the admin by adminId
    const admin = await Admin.findOne({ adminId: adminId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete the admin account
    await Admin.deleteOne({ adminId });

    res.status(200).json({ message: "Admin account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// adminAuth.js (routes/adminAuth.js)
// ... (previous code)

app.post("/admin/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by adminId
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin email" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//done verification of routes till this
//get partners details
//successed
app.get("/admin/admins/partnersdetails", async (request, response) => {
  const partners = await Partner.find({ status: "Verified" });
  console.log(partners);
  if (!partners) {
    return response.status(401).json({ message: "invalid partner" });
  } else {
    return response.status(200).json(partners);
  }
});

module.exports = app;
