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
      const data = new cabsModel(req.body)
    const cabResponce = await data.save();
       res.status(200).json(cabResponce)
    }catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
};
// saved Drivers
exports.savedDriver = async (req,res) =>{
   try{
    const emailExist = await driverModel.findOne({email:req.body.email});
    if(emailExist){
        res.status(400).send("email is already exist")
    }
    const saltRounds = 10;   // bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);//hashedPassword
    req.body.password = hashedPassword;
    const drivers = new driverModel(req.body);
    await drivers.save();
    res.status(200).json(drivers)
   }catch(err){
    console.log(err);
    res.status(400).send({error:err})
   }
};
//saved Customers
exports.saveCustomer = async(req,res) => {
    try{
        const emailExist = await customerModel.findOne({email:req.body.email});
        if(emailExist){
            res.status(200).send("Email is Already Exist")
        }else{
            const saltRounds = 10;   // bcrypt
            const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);//hashedPassword
            req.body.password = hashedPassword;
            const customers = new customerModel(req.body);
            await customers.save();
            res.status(400).json(customers)
        }
    }catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
};

//registerUser

exports.register = async(req,res) =>{
    try{
        const {username,email,password,conformpassword} = req.body;
        const emailExist = await register.findOne({email});
        if(emailExist){
           return res.status(400).send("user Already Register")
        };
        if(password !== conformpassword ){
           return res.status(401).send('passwords not matched')
        };
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const newUser = new register({
            username,
            email,
            password : hashedPassword,
            conformpassword
        });
        await newUser.save();
     return res.status(200).json({message : "Register Sucessfully"})
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
            return res.status(400).json({message:"User Not Found"})
        };
        const ismatch = await bcrypt.compare(password,usernameExist.password);
        if(!ismatch){
            return res.status(400).jason({message:"Invalid Creadentiales"})
        }
        const payLoad = {
            user :{
                id : usernameExist.id
            }
        };
        const jwtToken = await jwt.sign(payLoad,"secret",{expiresIn:"1h"});
        return res.status(200).json({jwtToken})
    }catch(err){
        res.status(400).send(err)
    }
}