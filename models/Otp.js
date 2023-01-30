const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    otp: {
        type: String,
    },
    created_at: {
        type: String,
        default: Date.now
    },
    update_at: {
        type: String,
        default: Date.now
    }
})


module.exports = mongoose.model("Otp", schema)