const mongoose = require('mongoose');
const { Schema } = mongoose;


const optionSchema = new Schema({
    event: String,
    rating:Number
});

exports.OPTION = mongoose.model('Option', optionSchema);