const express = require("express");
const router = express();

const {saveCabeUser,saveCustomer,savedDriver,register,loginUser} = require('../../controllers/cabUsers');

router.post("/savedcab",saveCabeUser);
router.post("/savedCustomer",saveCustomer);
router.post("/savedDrivers",savedDriver);
router.post("/register",register);
router.post("/login",loginUser)






module.exports = router;