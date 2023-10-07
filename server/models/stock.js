const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    name:String,
    Price:Number,
},
     {
         timestamps:true
     }
);

const stock = mongoose.model('Stocks', stockSchema);

module.exports = stock;
