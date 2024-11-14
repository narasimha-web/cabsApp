const mongoose = require("mongoose");

const payments = new mongoose.Schema({
    tripId :{
        type : mongoose.Schema.Types.ObjectId,
        ref :"trips",
        required : false
    },
    method : {
        type : String,
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