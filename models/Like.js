const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    short_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortVideo",
        // required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        // required: true
    },

    is_like: {
        type: Boolean,
        default: false,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Like", schema);