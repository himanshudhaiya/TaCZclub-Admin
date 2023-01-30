const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  mobile_number: {
    type: String,
    max: 10,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  referral_code: {
    type: String,
  },
  referral_count: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: String,
    default: Date.now,
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", schema);