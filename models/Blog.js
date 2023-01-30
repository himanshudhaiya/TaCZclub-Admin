const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  heading: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  date_time: {
    type: String,
    require: true,
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

schema.index({
  heading: "text",
  description: "text",

});
module.exports = mongoose.model("Blog", schema);