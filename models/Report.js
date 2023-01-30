const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Report", schema);