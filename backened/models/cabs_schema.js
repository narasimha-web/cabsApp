const mongoose = require("mongoose")

const cabs = new mongoose.Schema({
    driverId:{
        type : mongoose.Schema.Types.ObjectId,
        required:false,
        ref :"drivers"
    },
    type :{
        type :String,
        enum: ['car', 'auto', 'bike',"bus"] 
    },
    regNo :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('cabs',cabs)