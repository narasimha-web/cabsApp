const mongoose = require("mongoose");

const rating = new mongoose.Schema({
    customerId : {
        type : Number,
        required : true
    },
    driverId : {
        type : Number,
        required : true
    },
    tripId :{
        type : Number,
        required : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    feedback : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("ratings",rating)