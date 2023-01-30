const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        // required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    message: {
        type: String,
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
module.exports = mongoose.model("CommentReply", schema);