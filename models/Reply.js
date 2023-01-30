const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    support_message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Support_message'
    },
    text: {
        type: String,
        // required: true
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

module.exports = mongoose.model('Reply', schema);