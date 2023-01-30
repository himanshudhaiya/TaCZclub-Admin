const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    views: {
        type: Number,
        default: 0
    },
    shortVideo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShortVideo',

    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

module.exports = mongoose.model('Views', schema);