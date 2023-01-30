const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        shortVideo_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShareVideo",
        },
        user_id: {
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
    }

    // , {
    //     timestamps: true 
    // }
);
module.exports = mongoose.model("PostSave", Schema);