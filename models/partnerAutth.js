// models/partner.js
const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    aadharNum: { type: String },
    documentsubmitted: {
      type: Boolean,
      required: false,
    },
    panNum: { type: String },
    documents: [{ type: String }],
    otp: { type: String },
    partnerworkstatus: {
      type: String,
      enum: ["Ongoing", "Completed", "Upcoming"],
      default: "Upcoming",
      required: false,
    },
    status: {
      type: String,
      enum: ["Unverified", "Verified", "Denied"],
      default: "Unverified",
    },
    adminid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: false,
      },
    ],
    date: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    serviceassigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
