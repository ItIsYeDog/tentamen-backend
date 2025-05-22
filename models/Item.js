const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item er required']
    },
    description: String,
}, { timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;