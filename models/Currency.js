const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    currency: {
        type: Number,
        required: true
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

module.exports = mongoose.model('Currency', schema)