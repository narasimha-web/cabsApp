const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageModel = require("../../models/image_Schema"); // Ensure this path is correct

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadedFiles/"); // Folder where images are stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: fileFilter,
});

// File upload route
router.post("/fileupload", upload.single("image"), async (req, res) => {
  try {
    const filename = req.file.filename;
    const url = `http://localhost:3000/uploadedFiles/${filename}`; // URL of the uploaded image

    // Save file details to the database
    const newFile = new ImageModel({ filename, url });
    await newFile.save();

    // Send response
    res.json({
      message: "Image Uploaded Successfully",
      filename: filename,
      url: url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
});

module.exports = router;
