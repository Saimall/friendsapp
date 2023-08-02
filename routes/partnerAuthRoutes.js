const express = require('express');
const Partner = require('../models/partnerAutth');
const session = require("express-session");

const app = express.Router();
function generateOTP(length = 6) {
    const chars = '0123456789'; // characters from which OTP will be generated
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }
    return otp;
  }

app.use(
  session({
   secret: "my-super-secret-key-21728172615261562",
   resave: false,
   saveUninitialized:false, 
   cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hours
    },
  })
)

app.post('/partner/signup', async (req, res) => {
    try {
      const { name, contact, email, password, city } = req.body;

      // Check if email or contact already exists in the database
    const existingPartner = await Partner.findOne({ $or: [{ email }, { contact }] });
    if (existingPartner) {
      return res.status(409).json({ success: false, message: 'Email or contact already exists.' });
    }

      const otp = generateOTP(); // Generate a 6-digit OTP

      // Send OTP via Twilio
      // await sendOtpViaTwilio(contact, otp);
      // Create a new partner document with signup data and OTP
      console.log(otp)
      const partner = new Partner({ name, contact, email, password, city, otp });
      await partner.save();
  
      res.json({ success: true, message: 'OTP sent for verification.' });
    } catch (err) {
      console.log(err)
      res.status(500).json({ success: false, message: 'Error signing up.' });
    }
  });
  app.post('/partner/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if a partner with the provided email exists in the database
      const partner = await Partner.findOne({ email });
      if (!partner) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      // Compare the provided password with the hashed password in the database
      if (password !== partner.password) {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
      }
      const otp = generateOTP(); // Generate a 6-digit OTP
      partner.otp = otp;
      await partner.save();
  
      // Password is correct, create a session or token to authenticate the user (not shown in this example)
      // You can use JSON Web Tokens (JWT) or a session-based approach for authentication.
  
      res.json({ success: true, message: 'User signed in successfully.' });
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
app.post('/partner/verify/otp', async (req, res) => {
  try {
    const { id, enteredOTP } = req.body;
    console.log(enteredOTP)
    // Find the partner based on the ID
    const partner = await Partner.findById(id);

    // Check if the partner is not found in the database
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found.' });
    }

    // Check if the entered OTP matches the one in the document
    if (partner.otp !== enteredOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // OTP is valid, send success response
    res.json({ success: true, message: 'OTP verification successful.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Error verifying OTP.' });
  }
});

// Endpoint for document submission
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
app.post('/partner/approve', async (req, res) => {
  try {
    const { id } = req.body;
    const partner = await Partner.findById(id);

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
router.get('/partners/:partnerId/cities', async (req, res) => {
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

module.exports = app;