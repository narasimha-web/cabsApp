const express = require("express");
const router = express.Router();
const multer = require("multer");
const registerModal = require("../../models/register_schema"); // Assuming this is your user schema

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
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// File upload route
router.post("/fileupload", upload.single("image"), async (req, res) => {
  try {
    const { email } = req.body; // Get the user's email (you can also use username if needed)
    const filename = req.file.filename;
    const user = await registerModal.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fileName = filename;
    await user.save();
    res.json({
      message: "Image Uploaded Successfully",
      fileName: filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
});

module.exports = router;
