const express = require('express');
const router = express.Router();
const City = require('../models/city');



router.post('/cities', async (req, res) => {
  try {
    const { name, pincodes } = req.body;
    const city = new City({ name, pincodes });
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ error: 'Unable to add the city.' });
  }
});

router.get('/cities', async (req, res) => {
    try {
      const cities = await City.find();
      res.json(cities);
    } catch (err) {
      res.status(500).json({ error: 'Unable to fetch cities.' });
    }
  });

  router.put('/cities/:cityId', async (req, res) => {
    try {
      const { cityId } = req.params;
      const { name, pincodes } = req.body;
      const updatedCity = await City.findByIdAndUpdate(
        cityId,
        { name, pincodes },
        { new: true }
      );
      res.json(updatedCity);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update the city.' });
    }
  });

  router.delete('/cities/:cityId', async (req, res) => {
    try {
      const { cityId } = req.params;
      await City.findByIdAndDelete(cityId);
      res.json({ message: 'City deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Unable to delete the city.' });
    }
  });








  router.get('/cities/:cityId/pincodes', async (req, res) => {
    try {
      const { cityId } = req.params;
      const city = await City.findById(cityId);
      if (!city) {
        return res.status(404).json({ error: 'City not found.' });
      }
      const pincodes = city.pincodes;
      res.json(pincodes);
    } catch (err) {
      res.status(500).json({ error: 'Unable to fetch pincodes for the city.' });
    }
  });

  
  router.put('/cities/:cityId/pincodes', async (req, res) => {
    try {
      const { cityId } = req.params;
      const { pincodes } = req.body;
      const updatedCity = await City.findByIdAndUpdate(
        cityId,
        { pincodes },
        { new: true }
      );
      res.json(updatedCity);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update pincodes of the city.', details: err.message });
    }
  });

  
  router.delete('/cities/:cityId/pincodes/:pincodeId', async (req, res) => {
    try {
      const { cityId, pincodeId } = req.params;
      const city = await City.findById(cityId);
      if (!city) {
        return res.status(404).json({ error: 'City not found.' });
      }
  
      const pincodeIndex = city.pincodes.indexOf(pincodeId);
      if (pincodeIndex === -1) {
        return res.status(404).json({ error: 'Pincode not found in the city.' });
      }
  
      // Remove the pincode from the city's pincodes array
      city.pincodes.splice(pincodeIndex, 1);
      await city.save();
  
      res.json({ message: 'Pincode deleted successfully from the city.' });
    } catch (err) {
      res.status(500).json({ error: 'Unable to delete the pincode from the city.', details: err.message });
    }
  });
  

  


module.exports = router;
