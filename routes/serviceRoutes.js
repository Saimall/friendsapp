const express = require('express');
const router = express.Router();
const Service = require('../models/service');

router.post('/services', async (req, res) => {
  try {
    const { name } = req.body;
    const service = new Service({ name });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Unable to add the service.' });
  }
});

router.get('/services', async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: 'Unable to fetch services.' });
    }
  });

// Get all Daily Services
router.get('/services/daily', async (req, res) => {
  try {
    const dailyServices = await Service.find({ type: 'Daily' }).populate('cities', 'name');
    res.json(dailyServices);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch daily services.' });
  }
});

// Get all Monthly Services
router.get('/services/monthly', async (req, res) => {
  try {
    const monthlyServices = await Service.find({ type: 'Monthly' }).populate('cities', 'name');
    res.json(monthlyServices);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch monthly services.' });
  }
});
router.post('/services/check-availability', async (req, res) => {
  try {
    const { cityId, serviceId } = req.body;

    // Check if the provided city and service IDs are valid
    const city = await City.findById(cityId);
    const service = await Service.findById(serviceId);

    if (!city || !service) {
      return res.status(400).json({ error: 'Invalid city or service ID.' });
    }

    // Check if the service is available in the city
    if (service.cities.includes(cityId)) {
      // Service is available, return its sub-services
      const subServices = await SubService.find({ service: serviceId }).populate('service', 'name');
      res.json(subServices);
    } else {
      // Service is not available in the city
      res.json({ message: 'This service is not available in your city right now.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Unable to check service availability.' });
  }
});

router.put('/services/:serviceId', async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { name } = req.body;
      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        { name },
        { new: true }
      );
      res.json(updatedService);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update the service.' });
    }
  });

  router.delete('/services/:serviceId', async (req, res) => {
    try {
      const { serviceId } = req.params;
      await Service.findByIdAndDelete(serviceId);
      res.json({ message: 'Service deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Unable to delete the service.' });
    }
  });


module.exports = router;
