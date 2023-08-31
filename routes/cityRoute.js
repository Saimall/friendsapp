const express = require('express');
const app = express.Router();
const City = require('../models/city');

app.use(express.json());

app.post('/cities', async (req, res) => {
  try {
    const {name,pincodes} = req.body;
    console.log('Name:', name); // Debugging line
    console.log('Pincodes:', pincodes); // Debugging line
    if (!name || !pincodes || !Array.isArray(pincodes)) {
      return res.status(400).json({ error: 'Invalid input..' });
    }
    const newcity = new City({ name, pincodes });
    const savedcity = await newcity.save();
    return res.status(200).json(savedcity);
  } catch (err) {
    return res.status(500).json({ error: 'Unable to add the city.' });
  }
});

app.get('/cities', async (req, res) => {
    try {
      const cities = await City.find();
      return res.json(cities);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to fetch cities.' });
    }
  });

  app.put('/cities/:cityId', async (req, res) => {
    try {
      const { cityId } = req.params;
      const { name, pincodes } = req.body;
      const updatedCity = await City.findByIdAndUpdate(
        cityId,
        { name, pincodes },
        { new: true }
      );
      return res.json(updatedCity);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to update the city.' });
    }
  });

  app.delete('/cities/:cityId', async (req, res) => {
    try {
      const { cityId } = req.params;
      await City.findByIdAndDelete(cityId);
      return res.json({ message: 'City deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ error: 'Unable to delete the city.' });
    }
  });








  app.get('/cities/:cityId/pincodes', async (req, res) => {
    try {
      const { cityId } = req.params;
      const city = await City.findById(cityId);
      if (!city) {
        return res.status(404).json({ error: 'City not found.' });
      }
      const pincodes = city.pincodes;
      return res.json(pincodes);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to fetch pincodes for the city.' });
    }
  });

  
  app.put('/cities/:cityId/pincodes', async (req, res) => {
    try {
      const { cityId } = req.params;
      const { pincodes } = req.body;
      const updatedCity = await City.findByIdAndUpdate(
        cityId,
        { pincodes },
        { new: true }
      );
      return res.json(updatedCity);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to update pincodes of the city.', details: err.message });
    }
  });

  
  app.delete('/cities/:cityId/pincodes/:pincodeId', async (req, res) => {
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
  
      return res.json({ message: 'Pincode deleted successfully from the city.' });
    } catch (err) {
      return res.status(500).json({ error: 'Unable to delete the pincode from the city.', details: err.message });
    }
  });
  

  


module.exports = app;
