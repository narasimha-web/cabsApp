const mongoose = require("mongoose")

const cabs = new mongoose.Schema({
    driverId:{
        type : String,
        required:true
    },
    type :{
        type :String,
        enum: ['cab', 'auto', 'bike'] 
    },
    regNo :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('cabs',cabs)