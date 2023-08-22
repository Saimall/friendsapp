const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const Partner = require('./models/partnerAutth'); // Ensure the correct model name
const mongoose = require('mongoose'); // Import mongoose
const adminAuthRoutes=require('./routes/adminAuthRoutes');
const customerAuthRoutes=require('./routes/customerAuthRoute');
const partnerAuthRoutes=require('./routes/partnerAuthRoutes');
const serviceRoutes=require('./routes/serviceRoutes');
const subServiceRoutes=require('./routes/subServiceRoutes');
const bookingRoutes=require('./routes/booking');
const app = express();


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Friends App',
      version: '1.0.0',
    },
    components: {
      requestBodies: {
        // Add your request body definitions here
        AdminSignup: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  adminId: {
                    type: 'string',
                    example: 'admin123',
                  },
                  password: {
                    type: 'string',
                    example: 'password123',
                  },
                },
              },
            },
          },
          AdminUpdatePassword: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                   oldPassword : {
                      type: 'string',
                    },
                    newPassword: {
                      type: 'string',
                    },
                  },
                },
              },
            }
        },
      }
        
      },
    },
    servers:[
      {
        url:'http://localhost:3000/'
      }
    ] 
  },
  apis: ['./routes/*.js'], // Update with the correct path to your routes file
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




const port = 3000; // Replace with your desired port number

app.use(bodyParser.json());

app.use(customerAuthRoutes);
app.use(partnerAuthRoutes);
app.use(adminAuthRoutes);
app.use(serviceRoutes);
app.use(subServiceRoutes);
// app.use(cityRoutes);
app.use(bookingRoutes);

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



