"useStrict";

const cabsModel = require("../models/cabs_schema");
const customerModel = require("../models/customers_schema");
const driverModel = require("../models/drivers_schema");
const paymentModel = require("../models/payments_schema");
const ratingModel = require("../models/ratings_schema");
const tripsModel = require("../models/trips_schema");
const register = require("../models/register_schema");
const profileImage = require("../models/image_Schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//=====================================================================================saved CabUsers

exports.getProfileImage = async (req, res) => {
  try {
    const responce = await register.find();
    res.status(200).send({
      status: 0,
      data: responce,
      img: responce.map((image) => image.fileName),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.saveCabeUser = async (req, res) => {
  try {
    const data = new cabsModel(req.body);
    const cabResponce = await data.save();
    const cabsId = cabResponce._id;
    const driverID = await driverModel.findOneAndUpdate(
      //to send the cabId to drivers
      { _id: req.body.driverId },
      { $set: { cabId: cabsId } },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: 0, cabResponce, driverID });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err });
  }
};
exports.cabDrivers = async (req, res) => {
  try {
    const responce = await driverModel.find();
    res.status(200).send({ status: 0, responce });
  } catch (err) {
    console.log(err);
  }
};
//============================================================================================fetchcabs
exports.fetchCabs = async (req, res) => {
  try {
    const page =
      parseInt(req.query.page) > 0 ? parseInt(req.query.page) - 1 : 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const totalCount = await cabsModel.countDocuments();
    const responce = await cabsModel.aggregate([
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driverInfo",
        },
      },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ]);
    res.status(200).send({
      status: 0,
      data: responce,
      pageCount: Math.ceil(totalCount / pageSize),
      totalCount,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
//========================================================================================editcabs
exports.editCab = async (req, res) => {
  try {
    const responce = await cabsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!responce) {
      return res.status(400).send({ status: 1, message: "User Not Found" });
    }
    res.status(200).json({ status: 0, responce });
  } catch (err) {
    console.log(err);
  }
};
//===================================================================================delete cabs
exports.cabDelete = async (req, res) => {
  try {
    const response = await cabsModel.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(400).json({ status: 1, message: "userNot Found" });
    }
    res.status(200).send({ status: 0, message: "Data Delete Sucessfully" });
  } catch (err) {
    console.log(err);
  }
};
//-------------------------------------------------------------------------------------- saved Drivers----
exports.savedDriver = async (req, res) => {
  try {
    const emailExist = await driverModel.findOne({ email: req.body.email });
    if (emailExist) {
      return res
        .status(200)
        .json({ status: 1, message: "email is already exist" });
    }
    // hashed passwords
    const saltRounds = 10; // bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); //hashedPassword
    req.body.password = hashedPassword;
    req.body.createdAt = new Date();
    const drivers = new driverModel(req.body);
    await drivers.save();
    res.status(200).json({ status: 0, drivers });
  } catch (err) {
    console.log(err);
    res.status(400).send({ status: 1, error: err });
  }
};
//===============================================================================updateDrivers
exports.updateDriver = async (req, res) => {
  try {
    const responce = await driverModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!responce) {
      return res.status(400).send({ status: 1, message: "userNot Found" });
    }
    res.status(200).json({ status: 0, responce });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err });
  }
};

//--------------------------------------------------------------------------------fetch Drivers
exports.fetchCabDrivers = async (req, res) => {
  try {
    const page =
      parseInt(req.query.page) > 0 ? parseInt(req.query.page) - 1 : 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const totalCount = await driverModel.countDocuments();
    const fetchData = await driverModel.aggregate([
      {
        $lookup: {
          from: "cabs",
          localField: "cabId",
          foreignField: "_id",
          as: "cabInfo",
        },
      },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ]);
    res.status(200).send({
      status: 0,
      data: fetchData,
      pageCount: Math.ceil(totalCount / pageSize),
      totalCount,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
//===========================================================================================================search Items
exports.searchItem = async (req, res) => {
  try {
    const { searchField } = req.body;
    if (
      !searchField ||
      typeof searchField !== "string" ||
      searchField.trim().length === 0
    ) {
      return res.status(400).json({ error: "Invalid or empty search input" });
    }

    const response = await driverModel.aggregate([
      {
        $match: {
          name: { $regex: searchField, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "cabs",
          localField: "cabId",
          foreignField: "_id",
          as: "cabInfo",
        },
      },
    ]);

    // If no matches found
    if (response.length === 0) {
      return res
        .status(404)
        .json({ status: 1, message: "No matching items found" });
    }

    // Send the matched results
    res.status(200).json({ data: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --------------------------------------------------------------------------------delete Drivers
exports.driverDelete = async (req, res) => {
  try {
    const response = await driverModel.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(400).json({ status: 1, message: "Driver Not Found" });
    }
    res.status(200).send({ status: 0, message: "Delete Sucessfully" });
  } catch (err) {
    console.log(err);
  }
};
//-------------------------------------------------------------------------------------------------saved Customers
exports.saveCustomer = async (req, res) => {
  try {
    const emailExist = await customerModel.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(200).send("Email is Already Exist");
    } else {
      const saltRounds = 10; // bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); //hashedPassword
      req.body.password = hashedPassword;
      const customers = new customerModel(req.body);
      await customers.save();
      res.status(200).json(customers);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err });
  }
};
// -----------------------------------------------------------------------fetch customers
exports.fetchCustomers = async (req, res) => {
  try {
    const page =
      parseInt(req.query.page) > 0 ? parseInt(req.query.page) - 1 : 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const totalCount = await customerModel.countDocuments();
    const responce = await customerModel
      .find()
      .skip(page * pageSize)
      .limit(pageSize);

    res.status(200).send({
      status: 0,
      data: responce,
      pageCount: Math.ceil(totalCount / pageSize),
      totalCount,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
//========================================================================search Customer Item
exports.searchCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res
        .status(400)
        .json({ status: 1, error: "Invalid or empty name input" });
    }
    const responce = await customerModel.find({
      name: { $regex: name, $options: "i" },
    });
    if (responce.length === 0) {
      return res
        .status(400)
        .send({ status: 1, error: "No Matching Customers Found" });
    }
    res.status(200).json({ status: 0, data: responce });
  } catch (err) {
    console.log(err);
  }
};

//-------------------------------------------------------------------------register /newUser

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailExist = await register.findOne({ email });
    if (emailExist) {
      return res
        .status(400)
        .send({ status: 1, message: "user Already Register" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new register({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json({ status: 0, message: "Register Sucessfully" });
  } catch (err) {
    res.status(400).send({ error: err });
    6;
  }
};

//.........................=================================================================== loginUser

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usernameExist = await register.findOne({ username });
    if (!usernameExist) {
      return res.status(400).json({ status: 1, message: "User Not Found" });
    }
    const ismatch = await bcrypt.compare(password, usernameExist.password);
    if (!ismatch) {
      return res
        .status(400)
        .json({ status: 1, message: "Invalid Creadentiales" });
    }
    const payLoad = {
      user: {
        id: usernameExist.id,
      },
    };
    const jwtToken = await jwt.sign(payLoad, "secret", { expiresIn: "24h" });
    return res.status(200).json({ status: 0, jwtToken, user: usernameExist });
  } catch (err) {
    res.status(400).send(err);
  }
};

//========================================================================================== saved trips

exports.savedTrips = async (req, res) => {
  try {
    const { customerId, driverId, status, source, destination } = req.body;
    const tripData = {
      customerId,
      driverId,
      status,
      source,
      destination,
      createdAt: new Date(),
    };
    const savedTrip = await tripsModel.create(tripData);
    // saving PaymentRecord
    const paymentData = {
      tripId: savedTrip._id,
      method: req.body.paymentType,
      amount: req.body.amount,
      createdAt: new Date(),
    };
    const savedPayment = await paymentModel.create(paymentData);
    const updatedTrip = await tripsModel.findOneAndUpdate(
      { _id: savedTrip._id },
      { $set: { paymentId: savedPayment._id } },
      { new: true }
    );
    res.status(200).send({ status: 0, updatedTrip });
  } catch (err) {
    console.log(err);
  }
};
//=====================================================================================fetch Trips

exports.fetchTrips = async (req, res) => {
  try {
    // Parse query parameters for pagination
    const page =
      parseInt(req.query.page) > 0 ? parseInt(req.query.page) - 1 : 0; // 0-based index
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

    // Calculate the total count of documents
    const totalCount = await tripsModel.countDocuments();

    // Aggregation with pagination
    const response = await tripsModel.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "_id",
          as: "paymentDetails",
        },
      },
      { $skip: page * pageSize }, // Skip documents for pagination
      { $limit: pageSize }, // Limit the number of documents returned
    ]);

    // Send the response with pagination details
    res.status(200).send({
      status: 0,
      data: response,
      pageCount: Math.ceil(totalCount / pageSize),
      totalCount,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 1, error: "Internal Server Error" });
  }
};
// =============================================================================================edit Trips

exports.editTrip = async (req, res) => {
  try {
    const response = await tripsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(400).send({ status: 1, message: "user Not Found" });
    }
    res.status(200).send({ status: 0, response });
  } catch (err) {
    console.log(err);
  }
};
//========================================================find Date
exports.searchData = async (req, res) => {
  try {
    const { createdAt } = req.body;

    // Validate that createdAt exists
    if (!createdAt) {
      return res
        .status(400)
        .send({ status: 1, message: "The 'createdAt' field is required." });
    }

    // Parse the input date
    const inputDate = new Date(createdAt);
    if (isNaN(inputDate.getTime())) {
      return res
        .status(400)
        .send({ status: 1, message: "Invalid date format provided." });
    }

    // Set the input date to midnight (so that only the date, not the time, is considered)
    inputDate.setHours(0, 0, 0, 0);

    // Calculate the next day's midnight
    const nextDay = new Date(inputDate);
    nextDay.setDate(inputDate.getDate() + 1);

    // Perform the aggregation query
    const response = await tripsModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: inputDate, // Greater than or equal to the start of the input date
            $lt: nextDay, // Less than the next day (i.e., 1 day ahead)
          },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "_id",
          as: "paymentDetails",
        },
      },
    ]);

    // Check if records were found
    if (response.length === 0) {
      return res
        .status(404)
        .send({ status: 1, message: "No records found for the given date." });
    }

    // Return matching records
    return res.status(200).send({
      status: 0,
      message: "Data fetched successfully.",
      data: response,
    });
  } catch (err) {
    // Handle unexpected errors
    console.error("Error in searchData:", err.message);
    return res.status(500).send({
      status: 1,
      message: "An internal server error occurred.",
      error: err.message,
    });
  }
};
