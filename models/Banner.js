const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  basename: {
    type: String,
    max: 50,
    required: true,
  },
  created_at: {
    type: String,
    default: Date.now(),
  },
  updated_at: {
    type: String,
    default: Date.now(),
  }
});

Schema.index({
  content: "text"
});


module.exports = mongoose.model("Banner", Schema);