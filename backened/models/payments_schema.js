const mongoose = require("mongoose");

const payments = new mongoose.Schema({
    tripId :{
        type : Number,
        required : true
    },
    method : {
        type : Number,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("payments",payments)