const mongoose = require("mongoose");

const trips = new mongoose.Schema({
    customerId :{
        type : Number,
        required : true
    },
    driverId : {
        type : Number,
        required : true
    },
    paymentId : {
        type : Number,
        required : true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],  
        default: 'pending'
    },
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("trips",trips)