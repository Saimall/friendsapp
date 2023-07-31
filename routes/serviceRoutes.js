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
6
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
