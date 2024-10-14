const mongoose = require("mongoose");

const driver = new mongoose.Schema({
    name :{
        type :String,
        required : true
    },
    cabId:{
        type:String,
        required : true
    },
    email :{
        type : String,
        required : true,
        lowerCase : true
    },
    password : {
        type : String,
        required : true
    },
    dob :{
        type:Date,
        required : true
    },
    location :{
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
        }
    },
    createdAt : {
        type : Date,
        required : true
    }

});

module.exports = mongoose.model("drivers",driver)