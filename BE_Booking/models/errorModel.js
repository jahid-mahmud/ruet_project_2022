const mongoose = require('mongoose');
const { Schema } = mongoose;

const sourceSchema =  new Schema({
    component: String,
    host: String
  });

const errorSchema = new Schema({
    name: String,
    namespace: String,
    reason: String,
    message: String,
    source: sourceSchema,
    time: String,
    type: String,
    createDate: Date
});

exports.Error = mongoose.model('Error', errorSchema);