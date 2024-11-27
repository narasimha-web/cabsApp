const mongoose = require("mongoose");

const uploadedFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UploadedFile", uploadedFileSchema);
