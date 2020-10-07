const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cat = new Schema({
    breed: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        default: 0
    }
})

const Cat = mongoose.model('Cat', cat);

module.exports = Cat;