const mongoose = require('mongoose');


const partnerserviceSchema = new mongoose.Schema({
    partnerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner', // Reference to the SubService model
        required: true,
    },
    serviceid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner', // Reference to the SubService model
        required: true,
    },
    subserviceids:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subService', // Reference to the SubService model
        required: true,
    }],
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city', // Reference to the SubService model
        required: true,
    },
    pincodes:[{
        city:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'city', // Reference to the SubService model
            required: true,
        },
    }],
  
});

const City = mongoose.model('City', citySchema);

module.exports = City;
