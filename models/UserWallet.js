const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    shortVideo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShortVideo"
    },
    currency: {
        type: Number,
    },
    amount: {
        type: Number,
        default: 0,
    },
    transaction_type: {
        type: String,
        default: "credit",
    },
    transaction_Id: {
        type: String,
        default: "",
    },
    created_at: {
        type: String,
        default: Date.now
    },
    updeate_at: {
        type: String,
        default: Date.now
    }
})


module.exports = mongoose.model("UserWallet", schema)