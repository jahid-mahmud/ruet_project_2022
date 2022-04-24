const mongoose = require('mongoose');
const { Schema } = mongoose;


const requestSchema = new Schema({
    email: String,
    date : Date,
    event: String,
    name: String,
    reference : String,
    department : String,
    requeststatus: Boolean,
    id:String

});

exports.REQUEST = mongoose.model('Request', requestSchema);