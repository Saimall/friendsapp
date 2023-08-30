const express = require('express');
const Partner = require('../../models/partnerAutth');
const session = require("express-session");
const Booking = require('../../models/booking');
const Service = require('../../models/service');
const subService = require('../../models/subService');

const app = express.Router();
const bcrypt = require('bcrypt');

const partnerService = require('../../models/partnerServices');
const moment = require('moment');
const otpMap = new Map();




function generateOTP(length = 6) {
    const chars = '0123456789'; // characters from which OTP will be generated
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }
    return otp;
  }


app.post('/partner/deny', async (req, res) => {
  try {
    const { id } = req.body;
    const partner = await Partner.findById(id);

    // Check if the partner is already denied
    if (partner.status === 'Denied') {
      return res.json({ success: true, message: 'Partner already denied.' });
    }
       
    // Update the partner status to 'Denied'
    partner.status = 'Denied';
    await partner.save();

    res.json({ success: true, message: 'Partner request denied.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error denying partner request.' });
  }
});

app.get('/partner', async (req, res) => {
    try {
      const partner = await Partner.find();
      res.json({ success: true, partners: partner });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching unverified partners.' });
    }
  });

// Endpoint to get partners with 'Unverified' status
app.get('/partner/unverified', async (req, res) => {
  try {
    const unverifiedPartners = await Partner.find({ status: 'Unverified' });
    res.json({ success: true, partners: unverifiedPartners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching unverified partners.' });
  }
});

// Endpoint to get partners with 'Verified' status
app.get('/partner/verified', async (req, res) => {
  try {
    const verifiedPartners = await Partner.find({ status: 'Verified' });
    res.json({ success: true, partners: verifiedPartners });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Error fetching verified partners.' });
  }
});

// Endpoint to get partners with 'Denied' status
app.get('/partner/denied', async (req, res) => {
  try {
    const deniedPartners = await Partner.find({ status: 'Denied' });
    res.json({ success: true, partners: deniedPartners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching denied partners.' });
  }
});


//after vrifying otp we call use this route in frontend to pass data
//successed
app.post('/partner/signup', async (req, res) => {
    try {
      const { name, contact, email, password, city } = req.body;

      // Check if email or contact already exists in the database
    const existingPartner = await Partner.findOne({ $or: [{ email }, { contact }] });
    if (existingPartner) {
      return res.status(409).json({ success: false, message: 'Email or contact already exists.' });
    }
      // const otp = generateOTP(); // Generate a 6-digit OTP
      // otpMap.set(contact, { otp, expiresAt: moment().add(5, 'minutes') });

    
      // console.log(otp)
      // const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const partner = new Partner({ name, contact, email, password: hashedPassword, city, otp });
      await partner.save();
  
      res.json({ success: true, message: 'OTP sent for verification.' });
    } catch (err) {
      console.log(err)
      res.status(500).json({ success: false, message: 'Error signing up.' });
    }
  });

  //successed
  //same for signin also after verifing otp we will use this route to signin
  app.post('/partner/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if a partner with the provided email exists in the database
      const partner = await Partner.findOne({ email });
      if (!partner) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      const isPasswordValid = await bcrypt.compare(password, partner.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid  password' });
      }
  
      // Compare the provided password with the hashed password in the database
      // if (password !== partner.password) {
      //   return res.status(401).json({ success: false, message: 'Invalid password.' });
      // }
     
  
      // Password is correct, create a session or token to authenticate the user (not shown in this example)
      // You can use JSON Web Tokens (JWT) or a session-based approach for authentication.
  
      res.status(200).json(partner);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error signing in.' });
    }
  });

  async function sendOtpViaTwilio(phoneNumber, otp) {
    try {
      const accountSid = 'AC26e684e87d75ede313d980504ba2ffe5';
      const authToken = '337493fb81e37aad31aa2f6e4427ad62';
      const twilioPhoneNumber = 'VA4249c18d115426876c692ee1b4045158';
      const client = require('twilio')(accountSid, authToken);
  
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });
  
      console.log('OTP sent successfully via Twilio.');
    } catch (error) {
      console.error('Error sending OTP via Twilio:', error.message);
      throw new Error('Error sending OTP via Twilio.');
    }
  }

// Endpoint for OTP verification
//successed
// app.post('/partner/verify/otp', async (req, res) => {
//   try {
//     const contact = req.body.contact;
//     const enteredOTP = req.body.otp;
//     console.log(contact,enteredOTP)
//     const storedOTPInfo = otpMap.get(contact);

//     console.log('Stored OTP Info:', storedOTPInfo);
//     if (!storedOTPInfo) {
//         res.status(404).json({ message: 'OTP not found. Please generate a new OTP.' });
//         return;
//     }

//     if (moment().isAfter(storedOTPInfo.expiresAt)) {
//         otpMap.delete(phoneNumber);
//         res.status(400).json({ message: 'OTP expired. Please generate a new OTP.' });
//         return;
//     }

//     if (String(enteredOTP) === String(storedOTPInfo.otp)) {
//         otpMap.delete(contact);
//         res.json({ message: 'OTP verification successful.' });
//     } else {
//         res.status(401).json({ message: 'Invalid OTP.' });
//     }
//   }
//   catch(error){
//     res.json({message: "error occured in veriofying otp"})
//   }
  //   const { email, enteredOTP,conatct } = req.body;
  //   console.log(enteredOTP)
  //   // Find the partner based on the ID
  //   const partner = await Partner.findOne({email});
  //  console.log(partner.otp);
  //   // Check if the partner is not found in the database
  //   if (!partner) {
  //     return res.status(404).json({ success: false, message: 'Partner not found.' });
  //   }

  //   // Check if the entered OTP matches the one in the document
  //   if (partner.otp !== enteredOTP) {
  //     return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  //   }

  //   // OTP is valid, send success response
  //   res.json({ success: true, message: 'OTP verification successful.' });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  // }


// Endpoint for document submission
//pending
app.post('/partner/verify/documents', async (req, res) => {
  try {
    const { id, aadhardoc, pandoc,aadharNum,panNum } = req.body;

    // Find the partner based on the ID
    const partner = await Partner.findById(id);

    // Update the partner document with the submitted documents and change status
    partner.aadharNum = aadharNum;
    partner.panNum = panNum;
    partner.aadhardoc = aadhardoc;
    partner.pandoc = pandoc;
    partner.status = 'Unverified';
    await partner.save();

    res.json({ success: true, message: 'Verification successful. Partner added to partner request.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error verifying and submitting documents.' });
  }
});


// Endpoint for admin approval
//sussceed
app.post('/partner/approve', async (req, res) => {
  try {
    const { email } = req.body;
    const partner = await Partner.findOne({email});

    // Check if the partner is already verified
    if (partner.status === 'Verified') {
      return res.json({ success: true, message: 'Partner already verified.' });
    }

    // Update the partner status to 'Verified'
    partner.status = 'Verified';
    await partner.save();

    res.json({ success: true, message: 'Partner successfully approved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error approving partner request.' });
  }
});

// Endpoint for admin denial
app.post('/partner/deny', async (req, res) => {
  try {
    const { id } = req.body;
    const partner = await Partner.findById(id);

    // Check if the partner is already denied
    if (partner.status === 'Denied') {
      return res.json({ success: true, message: 'Partner already denied.' });
    }
       
    // Update the partner status to 'Denied'
    partner.status = 'Denied';
    await partner.save();

    res.json({ success: true, message: 'Partner request denied.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error denying partner request.' });
  }
});

app.get('/partner', async (req, res) => {
    try {
      const partner = await Partner.find();
      res.json({ success: true, partners: partner });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching unverified partners.' });
    }
  });

// Endpoint to get partners with 'Unverified' status
app.get('/partner/unverified', async (req, res) => {
  try {
    const unverifiedPartners = await Partner.find({ status: 'Unverified' });
    res.json({ success: true, partners: unverifiedPartners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching unverified partners.' });
  }
});

// Endpoint to get partners with 'Verified' status
app.get('/partner/verified', async (req, res) => {
  try {
    const verifiedPartners = await Partner.find({ status: 'Verified' });
    res.json({ success: true, partners: verifiedPartners });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Error fetching verified partners.' });
  }
});

// Endpoint to get partners with 'Denied' status
app.get('/partner/denied', async (req, res) => {
  try {
    const deniedPartners = await Partner.find({ status: 'Denied' });
    res.json({ success: true, partners: deniedPartners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching denied partners.' });
  }
});


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

    res.json(serviceCities);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch partner service cities.' });
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

    res.json({ success: true, message: `Partner is now ${status}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating partner status.' });
  }
});

module.exports =app;






