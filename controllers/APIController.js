const User = require("../models/users");
const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage: storage }).single("image"); // "image" is the name attribute in your form for the file input

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ message: "OK", data: users });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const createNewUser = async (req, res) => {
  // Handle file upload
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "File upload error" });
    } else if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    try {
      const { name, email, phone } = req.body;

      // Check if image file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newUser = new User({
        name,
        email,
        phone,
        image: req.file.filename, // Save the filename to the database
      });

      const savedUser = await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        data: savedUser,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};
const updateUsers = async (req, res) => {
  // Handle file upload
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "File upload error" });
    } else if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      let updateFields = { name, email, phone };

      // Check if image file is uploaded
      if (req.file) {
        updateFields.image = req.file.filename; // Update the image filename if a new image is uploaded
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  getAllUsers,
  createNewUser,
  updateUsers,
  deleteUser,
};
