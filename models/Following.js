const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        following_id: {
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

Schema.index({
    following_id: "text",
});
module.exports = mongoose.model("Following", Schema)