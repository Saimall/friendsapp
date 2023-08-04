const mongoose = require('mongoose');


const partnerservicesSchema = new mongoose.Schema({
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
        ref: 'City', // Reference to the SubService model
        required: true,
    },
    pincodes:[{
        city:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City', // Reference to the SubService model
            required: true,
        },
    }],
  
});

const partnerserviceSchema = mongoose.model('partnerserviceSchema', partnerservicesSchema);

module.exports = partnerserviceSchema;
