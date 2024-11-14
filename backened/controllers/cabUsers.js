"useStrict"

const cabsModel = require("../models/cabs_schema");
const customerModel = require("../models/customers_schema");
const driverModel = require("../models/drivers_schema");
const paymentModel = require("../models/payments_schema");
const ratingModel = require("../models/ratings_schema");
const tripsModel = require("../models/trips_schema");
const register = require("../models/register_schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

//saved CabUsers

exports.saveCabeUser = async(req,res) => {
    try{
      const data = new cabsModel(req.body);
    const cabResponce = await data.save();
         const cabsId = cabResponce._id
        const driverID = await driverModel.findOneAndUpdate( //to send the cabId to drivers
            { _id: req.body.driverId },
            { $set: { cabId: cabsId } },
            { upsert: true, new: true })
       res.status(200).json({status:0,cabResponce,driverID})
    }catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
};
exports.cabDrivers = async(req,res) =>{
    try{
        const responce = await driverModel.find();
        res.status(200).send({status:0,responce})
    }catch(err){
        console.log(err)
    }
}
//fetchcabs
exports.fetchCabs = async(req,res) =>{
    try{
        const responce = await cabsModel.aggregate([{$lookup:{from: "drivers",localField: "driverId",foreignField: "_id",as:"driverInfo"}}]);
        res.status(200).send({status:0,responce})
    }catch(err){
        console.log(err)
    }
};
//editcabs 
exports.editCab = async(req,res) =>{
    try{
        const responce = await cabsModel.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
        if(!responce){
         return res.status(400).send({status:1,message:"User Not Found"})
        }
        res.status(200).json({status:0,responce})
    }catch(err){
        console.log(err)
    }
};
//delete cabs
exports.cabDelete = async(req,res) =>{
    try{
        const response = await cabsModel.findByIdAndDelete(req.params.id);
        if(!response){
           return res.status(400).json({status:1,message:"userNot Found"})
        }
        res.status(200).send({status:0,message:"Data Delete Sucessfully"})
    }catch(err){
        console.log(err)
    }
}
//--------------------- saved Drivers------------------------------------------------------------------
exports.savedDriver = async (req,res) =>{
   try{
    const emailExist = await driverModel.findOne({email:req.body.email});
    if(emailExist){
        return res.status(200).json({status:1,message:"email is already exist"});
    }
    // hashed passwords
    const saltRounds = 10;   // bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);//hashedPassword
    req.body.password = hashedPassword;
    req.body.createdAt = new Date();
    const drivers = new driverModel(req.body);
    await drivers.save();
    res.status(200).json({status:0,drivers})
   }catch(err){
    console.log(err);
    res.status(400).send({status:1,error:err})
   }
};
//updateDrivers 
exports.updateDriver = async(req,res)=>{
    try{
        const responce = await driverModel.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true } )
        if(!responce){
            return res.status(400).send({status:1,message:"userNot Found"})
        }
        res.status(200).json({status:0,responce})
    }catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
};

//fetch CabDrivers
exports.fetchCabDrivers = async(req,res) =>{
    try{
     const fetchData = await driverModel.aggregate([{$lookup:{from: "cabs",localField: "cabId",foreignField: "_id",as:"cabInfo"}}]);
     res.status(200).send({status:0,fetchData})
    }catch(err){
        console.log(err)
    }
};
// delete Drivers
exports.driverDelete = async(req,res) =>{
    try{
        const response = await driverModel.findByIdAndDelete(req.params.id);
        if(!response){
           return res.status(400).json({status:1,message:"Driver Not Found"})
        }
        res.status(200).send({status:0,message:"Delete Sucessfully"})
    }catch(err){
        console.log(err)
    }
}
//saved Customers
exports.saveCustomer = async(req,res) => {
    try{
        const emailExist = await customerModel.findOne({email:req.body.email});
        if(emailExist){
           return res.status(200).send("Email is Already Exist")
        }else{
            const saltRounds = 10;   // bcrypt
            const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);//hashedPassword
            req.body.password = hashedPassword;
            const customers = new customerModel(req.body);
            await customers.save();
            res.status(200).json(customers)
        }
    }catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
};
// fetch customers 
exports.fetchCustomers =async(req,res) => {
    try{
        const responce = await customerModel.find()
        res.status(200).send({status:0,responce})
    }catch(err){
        console.log(err)
    }
}
//registerUser

exports.register = async(req,res) =>{
    try{
        const {username,email,password} = req.body;
        const emailExist = await register.findOne({email});
        if(emailExist){
           return res.status(400).send({status:1,message:"user Already Register"})
        };
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const newUser = new register({
            username,
            email,
            password : hashedPassword,
        });
        await newUser.save();
     return res.status(200).json({status:0,message : "Register Sucessfully"})
    }catch(err){
        res.status(400).send({error:err})
    };
};

// loginUser

exports.loginUser = async(req,res) => {
    try{
        const {username,password} = req.body;
        const usernameExist = await register.findOne({username});
        if(!usernameExist){
            return res.status(400).json({status:1,message:"User Not Found"})
        };
        const ismatch = await bcrypt.compare(password,usernameExist.password);
        if(!ismatch){
            return res.status(400).json({status:1,message:"Invalid Creadentiales"})
        }
        const payLoad = {
            user :{
                id : usernameExist.id
            }
        };
        const jwtToken = await jwt.sign(payLoad,"secret",{expiresIn:"1h"});
        return res.status(200).json({status:0,jwtToken})
    }catch(err){
        res.status(400).send(err)
    }
};

// saved trips

exports.savedTrips = async (req,res) => {
    try{
    const {customerId,driverId,status,source,destination} = req.body;
        const tripData = {
            customerId,
            driverId,
            status, 
            source, 
            destination,
            createdAt : new Date()
        }
     const savedTrip = await tripsModel.create(tripData);
     console.log(savedTrip)
      // saving PaymentRecord
      const paymentData = {
        tripId : savedTrip._id,
        method : req.body.method,
        amount : req.body.amount,
        createdAt : new Date()
      };
      const savedPayment = await paymentModel(paymentData);
     
 
    const updatedTrip = await tripsModel.findOneAndUpdate(
        { _id: savedTrip._id }, 
        {$set : {paymentId : savedPayment._id}},
        {new:true}
    )
     res.status(200).send({status:0,updatedTrip}) 
    }catch(err){
        console.log(err)
    }
};
//fetch Trips 

exports.fetchTrips = async (req,res) =>{ 
    try{
        const response  = await tripsModel.aggregate([
            {
              $lookup: {
                from: "customers",
                localField: "customerId",
                foreignField: "_id",
                as: "customerDetails"
              }
            },
            {
              $lookup: {
                from: "drivers",
                localField: "driverId",
                foreignField: "_id",
                as: "driverDetails"
              }
            },
            {
              $lookup: {
                from: "payments",
                localField: "paymentId",
                foreignField: "_id",
                as: "paymentDetails"
              }
            },
          
          ]);
          
      res.status(200).send({status:0,response})
    }catch(err){
        console.log(err)
    }
}





