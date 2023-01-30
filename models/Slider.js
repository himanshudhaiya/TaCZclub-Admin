const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  basename: {
    type: String,
    max: 50,
    required: true,
  },
  created_at: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Slider", sliderSchema);
