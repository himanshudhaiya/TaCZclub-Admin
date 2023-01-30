const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    follower_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    created_at: {
        type: String,
        default: Date.now,
    },
    updated_at: {
        type: String,
        default: Date.now,
    }
})

schema.index({
    followers_id: "text",
});
module.exports = mongoose.model("Followers", schema)