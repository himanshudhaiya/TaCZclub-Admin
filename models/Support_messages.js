const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required : true
    },
    email: {
        type: String,
        // required : true
    },
    message: {
        type: String,
        // required : true
    },
    mobile_number: {
        type: String,
        // required : true
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

schema.index({
    email: "text",
})
module.exports = mongoose.model("Support_messages", schema)