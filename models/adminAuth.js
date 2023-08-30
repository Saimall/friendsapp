// admin.js (models/admin.js)
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

  name: { type: String, required: true, unique: true },
  phonenumber:{type:Number,required:true,unique:true},
  email :{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  role :{type:String ,required:true, enum:['superadmin','supportteam','dutymanager','approvalteam']}

});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

// name,phonenumber,email,password,role {
      //superadmin
      //supportteam - service histroy
      ////dutymanager
       //approval team - pending request, partnerassigned
     
//}

