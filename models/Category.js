const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  icon: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  last_update_time: {
    type: String,
    default: Date.now,
  },
  created_at: {
    type: String,
    default: Date.now,
  },
});

Schema.index({
  name: "text"
});

module.exports = mongoose.model("Category", Schema);