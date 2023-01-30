const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    text: {
        type: String,
        maxlength: 150,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    },
    video: {
        type: String,
        required: true
    },
    gif: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        maxlength: 100
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approved: {
        type: Boolean,
        default: false
    },
    following_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "following"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

schema.index({
    text: "text",
    description: "text",
    video: "text",
    gif: "text",
});



module.exports = mongoose.model("Post", schema);