const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 1
    },
    category_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    approved: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }

})
schema.index({
    text: "text",
});

module.exports = mongoose.model('Text', schema);