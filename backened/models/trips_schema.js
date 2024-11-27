const mongoose = require("mongoose");

const trips = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "customers",
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "drivers",
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "payments",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("trips", trips);
