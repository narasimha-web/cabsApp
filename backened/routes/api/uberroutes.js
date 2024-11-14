const express = require("express");
const router = express();

const {saveCabeUser,saveCustomer,savedDriver,register,loginUser,fetchCabDrivers,updateDriver,fetchCabs,editCab,cabDelete,driverDelete,cabDrivers,fetchCustomers,savedTrips,payment,fetchTrips} = require('../../controllers/cabUsers');

router.post("/savedcab",saveCabeUser);
router.post("/savedCustomer",saveCustomer);
router.post("/savedDrivers",savedDriver);
router.post("/register",register);
router.post("/login",loginUser);
router.get("/drivers",fetchCabDrivers);
router.put("/updateDriver/:id",updateDriver);
router.get("/cabs",fetchCabs);
router.put("/editCab/:id",editCab);
router.delete("/cabDelete/:id",cabDelete);
router.delete("/driverDelete/:id",driverDelete);
router.get("/cabDriver",cabDrivers);
router.get("/fetchCustomers",fetchCustomers);
router.post("/savedTrips",savedTrips);
router.get("/trips",fetchTrips)






module.exports = router;