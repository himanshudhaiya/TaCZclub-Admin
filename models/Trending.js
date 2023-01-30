const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    tranding_count: {
        type: Number,
        // required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        // required: true   
    },
    short_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortVideo",
        // required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model("Trendings", schema);