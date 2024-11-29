const express = require("express");
const router = express();
const authToken = require("../../middlewares/authentication");

const {
  saveCabeUser,
  saveCustomer,
  savedDriver,
  register,
  loginUser,
  fetchCabDrivers,
  updateDriver,
  fetchCabs,
  editCab,
  cabDelete,
  driverDelete,
  cabDrivers,
  fetchCustomers,
  savedTrips,
  payment,
  fetchTrips,
  editTrip,
  searchData,
  searchItem,
  searchCustomer,
  getProfileImage,
} = require("../../controllers/cabUsers");

router.post("/savedcab", authToken, saveCabeUser);
router.post("/savedCustomer", authToken, saveCustomer);
router.post("/savedDrivers", authToken, savedDriver);
router.post("/register", register);
router.post("/login", loginUser);
router.get("/drivers", authToken, fetchCabDrivers);
router.put("/updateDriver/:id", authToken, updateDriver);
router.get("/cabs", authToken, fetchCabs);
router.put("/editCab/:id", authToken, editCab);
router.delete("/cabDelete/:id", authToken, cabDelete);
router.delete("/driverDelete/:id", authToken, driverDelete);
router.get("/cabDriver", authToken, cabDrivers);
router.get("/fetchCustomers", authToken, fetchCustomers);
router.post("/savedTrips", authToken, savedTrips);
router.get("/trips", authToken, fetchTrips);
router.put("/editTrip/:id", authToken, editTrip);
router.post("/findDate", searchData);
router.post("/searchItems", searchItem);
router.post("/searchCustomer", searchCustomer);
router.get("/profileImage", getProfileImage);
router.post("/uploadFile");

module.exports = router;
