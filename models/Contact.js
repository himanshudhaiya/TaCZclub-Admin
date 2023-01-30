const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  contact_name: {
    type: String,
    max: 50,
  },
  email: {
    type: String,
    max: 50,
    default: "null",
  },
  phone: {
    type: String,
    default: "null",
  },
  message: {
    type: String,
    default: "null",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", Schema);
