const express = require('express');
const bodyParser = require('body-parser');
// const swaggerJSDoc = require('swagger-jsdoc')
// const swaggerUi = require('swagger-ui-express')
// const Partner = require('./models/partner/partnerAuthRoutes'); // Ensure the correct model name
const mongoose = require('mongoose'); // Import mongoose
const adminAuthRoutes=require('./routes/admin/adminAuthRoutes');
const customerAuthRoutes=require('./routes/customer/customerAuthRoute');
const partnerAuthRoutes=require('./routes/partner/partnerAuthRoutes');
const serviceRoutes=require('./routes/services/serviceRoutes');
const subServiceRoutes=require('./routes/services/subServiceRoutes');
const bookingRoutes=require('./routes/booking');
const otpvalidation = require('./routes/otpvalidation');
const customer = require('./routes/customer/customer');
const profile = require('./routes/customer/profile');
const admin = require('./routes/admin/admin')
const app = express();


// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Friends App',
//       version: '1.0.0',
//     },
//     components: {
//       requestBodies: {
//         // Add your request body definitions here
//         AdminSignup: {
//           required: true,
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   adminId: {
//                     type: 'string',
//                     example: 'admin123',
//                   },
//                   password: {
//                     type: 'string',
//                     example: 'password123',
//                   },
//                 },
//               },
//             },
//           },
//           AdminUpdatePassword: {
//             required: true,
//             content: {
//               'application/json': {
//                 schema: {
//                   type: 'object',
//                   properties: {
//                    oldPassword : {
//                       type: 'string',
//                     },
//                     newPassword: {
//                       type: 'string',
//                     },
//                   },
//                 },
//               },
//             }
//         },
//       }
        
//       },
//     },
//     servers:[
//       {
//         url:'http://localhost:3000/'
//       }
//     ] 
//   },
//   apis: ['./routes/*.js'], // Update with the correct path to your routes file
// };

// const swaggerSpec = swaggerJSDoc(swaggerOptions);





const port = 3000; // Replace with your desired port number

app.use(bodyParser.json());

app.use(customerAuthRoutes);
app.use(partnerAuthRoutes);
app.use(profile)
app.use(adminAuthRoutes);
app.use(serviceRoutes);
app.use(subServiceRoutes);
app.use(bookingRoutes);
app.use(otpvalidation)
app.use(customer);
app.use(admin)

// Set up MongoDB connection
mongoose
  .connect('mongodb+srv://rameshwaramsaimallik:Honey081102@cluster0.rlltaue.mongodb.net/?retryWrites=true&w=majority', {
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



