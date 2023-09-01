const express = require('express');
const app = express.Router();
const Service = require('../../models/service');
const Customer = require('../../models/customerAuth');
const Partner = require('../../models/partnerAutth');
// const { app } = require('firebase-admin');

// app.post('/services', async (req, res) => {
//   try {
//     const { name } = req.body;
//     const service = new Service({ name });
//     await service.save();
//     res.status(201).json(service);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to add the service.' });
//   }
// });

// app.get('/services', async (req, res) => {
//     try {
//       const services = await Service.find();
//       res.json(services);
//     } catch (err) {
//       res.status(500).json({ error: 'Unable to fetch services.' });
//     }
//   });

// // Get all Daily Services
// app.get('/services/daily', async (req, res) => {
//   try {
//     const dailyServices = await Service.find({ type: 'Daily' }).populate('cities', 'name');
//     res.json(dailyServices);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch daily services.' });
//   }
// });

// // Get all Monthly Services
// app.get('/services/monthly', async (req, res) => {
//   try {
//     const monthlyServices = await Service.find({ type: 'Monthly' }).populate('cities', 'name');
//     res.json(monthlyServices);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch monthly services.' });
//   }
// });


// app.post('/services/check-availability', async (req, res) => {
//   try {
//     const { cityId, serviceId } = req.body;

//     // Check if the provided city and service IDs are valid
//     const city = await City.findById(cityId);
//     const service = await Service.findById(serviceId);

//     if (!city || !service) {
//       return res.status(400).json({ error: 'Invalid city or service ID.' });
//     }

//     // Check if the service is available in the city
//     if (service.cities.includes(cityId)) {
//       // Service is available, return its sub-services
//       const subServices = await SubService.find({ service: serviceId }).populate('service', 'name');
//       res.json(subServices);
//     } else {
//       // Service is not available in the city
//       res.json({ message: 'This service is not available in your city right now.' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to check service availability.' });
//   }
// });

// app.put('/services/:serviceId', async (req, res) => {
//     try {
//       const { serviceId } = req.params;
//       const { name } = req.body;
//       const updatedService = await Service.findByIdAndUpdate(
//         serviceId,
//         { name },
//         { new: true }
//       );
//       res.json(updatedService);
//     } catch (err) {
//       res.status(500).json({ error: 'Unable to update the service.' });
//     }
//   });

//   app.delete('/services/:serviceId', async (req, res) => {
//     try {
//       const { serviceId } = req.params;
//       await Service.findByIdAndDelete(serviceId);
//       res.json({ message: 'Service deleted successfully.' });
//     } catch (err) {
//       res.status(500).json({ error: 'Unable to delete the service.' });
//     }
//   });


//   app.get('/Book/:Subserviceid/:customerid',async(request,response)=>{
//     try{
//       const subServiceid = request.params.serviceid;
//       const customerid = request.params.customerid
//       const subService = await subService.findOne(suberviceid);
//       if(!subService){
//         response.json({message:'Service is invalid'});
//       }
//       const customer = await Customer.findOne(customerid);
//       if(!customer){
//         response.json({message:'Customer is invalid'});
//       }
//       const address_length = customer.address.length;
//       if(address_length==0){
//         response.json({message:"new address is detected"})// if address length is equal to zero we need to render request-1 page
//         //using response.render() we need to render the html page //need to be done by frontend by knowing the name of request page
//         // response.render("")= using this need to render the frontend enter a details page;
//       }
//       else{
//         const list_address = customer.address;
//         response.redirect(`/Book/${serviceid}/${customerid}/details`,{
//           list_address
//         }) //sending list of avaliable address to the Details page
//       }
//     }
//     catch(error){
//       res.status(500).json({ error: 'Unable to load enter details page.' });
//     }
//   });

//   //adding new entry details need to give this url in frontend after clicking next
//   app.post('/Book/:serviceid/:customerid/new_entery', async(request,response)=>{
//     const fullname = request.body.fullname;
//     const phoneNumber = request.body.phoneNumber;
//     const Pincode = request.body.Pincode;
//     const House =request.body.House;
//     const City = request.body.City;
//     const State = request.body.State;
//     //retreivng id
//     const customerid = request.params.customerid;
//     const customer = await Customer.findOne(customerid);
//     //validations while acceptings values
//     if(fullname==" " || fullname.length==0){
//       response.json({message:"Full name can not be empty"})//as of now just sending response to check
//       //we can redirect to same page depends on user need to communicate with frontend
//     }
//     if(phoneNumber==" " || phoneNumber.length==0){
//       response.json({message:"Full name can not be empty"})
     
//     }
//     if(Pincode==" " || Pincode.length==0){
//       response.json({message:"Full name can not be empty"})
     
//     }
//     if(House==" " || House.length==0){
//       response.json({message:"Full name can not be empty"})
      
//     }
//     if(City==" " || City.length==0){
//       response.json({message:"Full name can not be empty"})
     
//     }
//     if(State==" " || State.length==0){
//       response.json({message:"Full name can not be empty"})
    
//     }
    
//     //if everything okay the updating the data 
//     try{
//     const responseadded =   await Customer.findByIdAndUpdate(
//      customerid,
//      {address: [...fullname,...phoneNumber,...Pincode,...House,...City,...State,]}
//     )

//     if(responseadded){
//       response.json(responseadded);
//       // or we can redirect to Details page i.e Request-2 page using response.redirect()
//     }
//     else
//     {
//       response.json({message:"error while adding"});
//     }
//   }catch(error){
//     response.json({message:"Error while adding!!!!"});
//   }
   
//   })

//   //rednering response-2 page

//   app.get("/Book/:serviceid/:customerid/details",async(request,response)=>{
      
//     //validating customer and service for every page
//     const serviceid = request.params.serviceid;
//       const customerid = request.params.customerid
//       const service = await Service.findOne(serviceid);
//       if(!service){
//         response.json({message:'Service is invalid'});
//       }
//       const customer = await Customer.findOne(customerid);

//       if(!customer){
//         response.json({message:'Customer is invalid'});
//       }
//       else{
//         const address_array = customer.address;
//         //need to give front end page name in double quotes example index.html or any react page
//         response.redirect("",{
//           address_array
//         })
//       }
//   });


// //clicking on add to cart


// // ---------------------------------------------------------------------------------------------
// //cart adding

// app.post("/services/:customerid/addtocart", async(request,response)=>{

 
//   const customerid = request.params.customerid;
//   const { userId, subServiceId} = req.body;
//  const customer = Customer.findOne(customerid);
  

//   const existingItem = customer.cart.find(item => item.subService.toString() === subServiceId);
 
//   if(existingItem){
//     response.json({message:"error occured!! Already present"});
//   }
//   else{
//   customer.cart.push({ subService: subServiceId});
//   response.json({message:"Cart Added succesfully"});
//   }
// })

// app.get('/cart/:customerId', async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const customer = await Customer.findById(customerId);
//     const cart =customer.cart;
//     Customer.findById(customerId).populate('cart.subService', 'name price pincode');
//     res.json(customer.cart);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch cart.' });
//   }
// });

// app.delete('/cart/:customerId/:subServiceId', async (req, res) => {
//   try {
//     const { customerId, subServiceId } = req.params;
//     const customer = await Customer.findById(customerId);

//     if (!customer) {
//       return res.status(404).json({ error: 'Customer not found.' });
//     }

//     customer.cart = customer.cart.filter(item => item.subService.toString() !== subServiceId);
//     await customer.save();
//     res.json(customer.cart);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to remove sub-service from cart.' });
//   }
// });

// // Get available services based on selected city
// app.get('/services/:cityId', async (req, res) => {
//   try {
//     const { cityId } = req.params;

//     // Find the city by its ID
//     const city = await City.findById(cityId);
//     if (!city) {
//       return res.status(404).json({ error: 'City not found.' });
//     }

//     // Get the available services for the selected city
//     const availableServices = await Service.find({ cities: cityId });

//     res.json(availableServices);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch available services for the selected city.' });
//   }
// });

// //Get available Daily service's on selected City 

// app.get('/services/:pincode/daily', async (req, res) => {
//   try {
//     const { pincode } = req.params;

//     // Retrieve the city based on the pincode
//     const city = await City.findOne({ pincodes: pincode });
//     if (!city) {
//       return res.status(404).json({ error: 'City not found for the given pincode.' });
//     }

//     // Fetch all service categories that are associated with the city
//     const services = await Service.find({ cities: city._id, type: 'Daily' });

//     res.json(services);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch services.' });
//   }
// });

// //Get available Daily service's on selected City 

// app.get('/services/:pincode/Monthly', async (req, res) => {
//   try {
//     const { pincode } = req.params;

//     // Retrieve the city based on the pincode
//     const city = await City.findOne({ pincodes: pincode });
//     if (!city) {
//       return res.status(404).json({ error: 'City not found for the given pincode.' });
//     }

//     // Fetch all service categories that are associated with the city
//     const services = await Service.find({ cities: city._id, type: 'Monthly' });

//     res.json(services);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch services.' });
//   }
// });


// //Get Subservice's based on pincode and serviceId 

// app.get('/services/:serviceId/:pincode/subservices', async (req, res) => {
//   try {
//     const { serviceId, pincode } = req.params;

//     // Retrieve the city based on the pincode
//     const city = await City.findOne({ pincodes: pincode });
//     if (!city) {
//       return res.status(404).json({ error: 'City not found for the given pincode.' });
//     }

//     // Fetch the requested service category (serviceId) and ensure it is associated with the city
//     const service = await Service.findOne({ _id: serviceId, cities: city._id });
//     if (!service) {
//       return res.status(404).json({ error: 'Service not found.' });
//     }

//     // Retrieve all the subservices of the requested service category that are available in the city
//     const subservices = await SubService.find({ service: service._id, pincodes: pincode });

//     res.json(subservices);
//   } catch (err) {
//     res.status(500).json({ error: 'Unable to fetch subservices.' });
//   }
// });








module.exports = app;
