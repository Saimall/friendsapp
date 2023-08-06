const express = require('express');
const Partner = require('../models/partnerAutth');
const session = require("express-session");
const Booking = require('../models/booking');
const Service = require('../models/service');
const subService = require('../models/subService');
const bcrypt = require('bcrypt');

const partnerService = require('../models/partnerServices');

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
//successed
app.post('/partner/signup', async (req, res) => {
    try {
      const { name, contact, email, password, city } = req.body;

      // Check if email or contact already exists in the database
    const existingPartner = await Partner.findOne({ $or: [{ email }, { contact }] });
    if (existingPartner) {
      return res.status(409).json({ success: false, message: 'Email or contact already exists.' });
    }

      const otp = generateOTP(); // Generate a 6-digit OTP

    
      console.log(otp)
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const partner = new Partner({ name, contact, email, password: hashedPassword, city, otp });
      await partner.save();
  
      res.json({ success: true, message: 'OTP sent for verification.' });
    } catch (err) {
      console.log(err)
      res.status(500).json({ success: false, message: 'Error signing up.' });
    }
  });

  //successed
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
app.post('/partner/verify/otp', async (req, res) => {
  try {
    const { email, enteredOTP } = req.body;
    console.log(enteredOTP)
    // Find the partner based on the ID
    const partner = await Partner.findOne({email});
   console.log(partner.otp);
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


// Endpoint to get partners with 'Ongoing' work status
app.get('/partners/ongoing', async (req, res) => {
  try {
    const ongoingPartners = await Partner.find({ partnerworkstatus: 'Ongoing' });
    res.json({ success: true, partners: ongoingPartners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching partners with ongoing work status.' });
  }
});

// Endpoint to get partners with 'Upcoming' work status
app.get('/partners/upcoming', async (req, res) => {
  try {
    const upcomingPartners = await Partner.find({ partnerworkstatus: 'Upcoming' });
    res.json({ success: true, partners: upcomingPartners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching partners with upcoming work status.' });
  }
});

// Endpoint to get partners with 'Completed' work status
app.get('/partners/completed', async (req, res) => {
  try {
    const completedPartners = await Partner.find({ partnerworkstatus: 'Completed' });
    res.json({ success: true, partners: completedPartners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching partners with completed work status.' });
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

    res.status(200).json({ totalEarnings: totalEarnings[0]?.total || 0 });
  } catch (error) {
    console.error('Error calculating total earnings:', error);
    res.status(500).json({ message: 'Server error' });
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

    res.json({ totalEarnings: totalEarnings[0]?.total || 0 });
  } catch (error) {
    console.error('Error calculating total earnings:', error);
    res.status(500).json({ message: 'Server error' });
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
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({ message: 'Server error' });
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

  bookingslist = Booking.find() //getting all reviews

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
  const partner = Partner.findOne(partnerid);
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

    if (!updatedPartner) {
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

app.get("/partnerservices/:partnerid",async(resquest,response)=>{

  const partnerid= request.params.partnerid;

  const partner = Partner.findOne(partnerid);
  const listserviceids = partner.serviceassigned;
  let list_services_montly=[];
  let list_services_daily=[];
  for(let i=0;i<listserviceids.length;i++){
     const service = Service.findById(listserviceids[0]);
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
  const partner = Partner.findById(partnerid);
  if(!partner){
    return response.status(400).json({message:"invalid partner"});
  }

  const serviceidslist = partner.serviceassigned;  
  let servicelist = [];
  for(let i=0;i<serviceidslist.length;i++){
          const service = Service.findById(serviceidslist[i]);
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
  const Subservice = subService.find({ _id:serviceid}); //getting list of sub services
if(!Subservice){
  return response.status(420).json({message:"invalid Subservice"});
}
 else{
  
  return response.status(200).json(Subservice);
 }
});


app.get("/modifyservice/:serviceid",async(request,response)=>{

  const serviceid = request.params.serviceid;
  
  const partnerservice = partnerService.findById(serviceid);

  return response.status(200).json(partnerservice);

})

app.post("/updating service",async(request,response)=>{

  const {subservice,city,servingpincodes} = request.body;

  
})



module.exports = app;