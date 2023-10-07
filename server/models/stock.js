const mongoose = require('mongoose');
const { Schema } = mongoose;
const stockSchema = new Schema({
    name:String,
    Price:Number,
},
     {
         timestamps:true
     }
);

const stock = mongoose.model('Stocks', stockSchema);

module.exports = stock;
