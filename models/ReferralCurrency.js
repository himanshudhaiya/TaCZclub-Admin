const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    referral_Currency: {
        type: Number,
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
});
module.exports = mongoose.model("ReferralCurrency", schema);