const express = require('express');
const router = express.Router();
const SubService = require('../models/subService');
const Service = require('../models/service');



router.post('/subservices', async (req, res) => {
  try {
    const { name, price, service } = req.body;
    
    // Check if the provided service exists
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(400).json({ error: 'Invalid service ID. Service does not exist.' });
    }
  
    const subService = new SubService({ name, price, service });
    await subService.save();
    res.status(201).json(subService);
  } catch (err) {
    res.status(500).json({ error: 'Unable to add the sub-service.' });
  }
});




router.get('/subservices', async (req, res) => {
  try {
    const subServices = await SubService.find();
    res.json(subServices);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch sub-services.' });
  }
});

router.post('/subservices/by-pincode', async (req, res) => {
  try {
    const { pincode, serviceId } = req.body;

    // Find the service by ID to validate the service existence
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ error: 'Invalid service ID.' });
    }

    // Find the sub-services that match the provided pincode
    const subServices = await SubService.find({
      service: serviceId,
      pincodes: pincode,
    }).populate('service', 'name');

    res.json(subServices);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch sub-services by pincode.' });
  }
});

  
router.get('/services/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    const subServices = await SubService.find({ service: serviceId });
    res.json({ service, subServices });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch service and its sub-services.' });
  }
});


router.put('/subservices/:subServiceId', async (req, res) => {
  try {
    const { subServiceId } = req.params;
    const { name, price, service } = req.body;
    
    // Check if the provided service exists
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(400).json({ error: 'Invalid service ID. Service does not exist.' });
    }
  
    const updatedSubService = await SubService.findByIdAndUpdate(
      subServiceId,
      { name, price, service },
      { new: true }
    );
    res.json(updatedSubService);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update the sub-service.' });
  }
});


router.delete('/subservices/:subServiceId', async (req, res) => {
  try {
    const { subServiceId } = req.params;
    await SubService.findByIdAndDelete(subServiceId);
    res.json({ message: 'Sub-service deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete the sub-service.' });
  }
});



module.exports = router;
