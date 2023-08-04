const express = require('express');
const bodyParser = require('body-parser');
const Partner = require('./models/partnerAutth'); // Ensure the correct model name
const mongoose = require('mongoose'); // Import mongoose
const adminAuthRoutes=require('./routes/adminAuthRoutes');
const customerAuthRoutes=require('./routes/customerAuthRoute');
const partnerAuthRoutes=require('./routes/partnerAuthRoutes');
const serviceRoutes=require('./routes/serviceRoutes');
const subServiceRoutes=require('./routes/subServiceRoutes');
const bookingRoutes=require('./routes/booking');





const app = express();
const port = 3000; // Replace with your desired port number

app.use(bodyParser.json());

app.use(customerAuthRoutes);
app.use(partnerAuthRoutes);
app.use('/admin',adminAuthRoutes);
app.use(serviceRoutes);
app.use(subServiceRoutes);
// app.use(cityRoutes);
app.use(bookingRoutes);

// Set up MongoDB connection
mongoose
  .connect('mongodb+srv://Friends:Friends@friendscluster.t70wgws.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection established');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });



