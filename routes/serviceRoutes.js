const express = require('express');
const app = express.Router();
const Service = require('../models/service'); // Adjust the path as needed
const { ObjectId } = require("mongodb");

// Create a new service
app.post('/service', async (req, res) => {
  try {
    const {name,type,price,cityname,subservices,image}=req.body;
    console.log("name",req.body.name);
    const service = await Service({name,type,price,cityname,subservices,image});
    await service.save();
    return res.status(200).json(service);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to create service' });
  }
});

// Get all services
app.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get services' });
  }
});

//updated service
app.put("/service/update/:serviceId", async (req, res) => {
    try {
      const {serviceId } = req.params;
      const {name,type,price,cityname,subservices,image } = req.body;
  
      if (!name && !type && !price&& !cityname && !subservices) {
        return res.status(400).json({ message: 'At least one attribute should be provided for modification' });
      }
  
  
      const service = await Service.findOne({ _id: new ObjectId(serviceId) });
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      if (image) {
        service.image = image;
      }
  
      if (name) {
        service.name = name;
      }
  
      if (type) {
        service.type = type;
      }
  
      if (cityname) {
        service.cityname = cityname;
      }
      if(subservices){
        service.subservices = subservices
      }
  
      await service.save();
  
      return res.status(200).json({ message: "Service updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  


//find by ID

app.get("/service/:serviceId", async (req, res) => {
    try {
      const { serviceId } = req.params;
     
      const service = await Service.findOne({ _id: new ObjectId(serviceId) });
      if (!service) {
        return res.status(404).json({ message: "service not found" });
      }
      return res.status(200).json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


// Delete a service
app.delete('/service/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findOne({ _id: new ObjectId( id) });
    console.log(service);
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }
    await Service.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({message:"Deleted Succesfullly"});
  } catch (error) {
    return res.status(400).json({ error: 'Failed to delete service' });
  }
});

//get service by ID
app.get('/servicetype/:type', async (req, res) => {
    try {
      const services = await Service.find({ type: req.params.type });
      return res.json(services);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get services by type' });
    }
  });

module.exports = app;
