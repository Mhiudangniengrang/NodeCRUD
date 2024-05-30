const User = require("../models/users");
const fs = require("fs");
const multer = require("multer");

const homePage = (req, res) => {
  User.find()
    .then((users) => {
      res.render("home", { users: users });
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
};
const detailUsers = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      res.render("detailUser", {
        user: user,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
};
// Logic for handling user addition
const addUsers = async (req, res) => {
  // Image upload configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
  }).single("image");

  // Handle file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.json({ message: err.message, type: "danger" });
    }

    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
      });

      await user.save();
      req.session.message = {
        type: "success",
        message: "User added successfully",
      };
      res.redirect("/home");
    } catch (err) {
      res.json({ message: err.message, type: "danger" });
    }
  });
};

// Function to render the addUser page
const addUsersPage = (req, res) => {
  // Add logic to render the addUser page here
  res.render("addUser");
};
const updateUsers = (req, res) => {
  // Image upload configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
  }).single("image");

  // Use upload as middleware in your route handler
  upload(req, res, (err) => {
    if (err) {
      // Handle upload error
      return res.status(500).json({ message: "Upload failed", error: err });
    }

    let id = req.params.id;
    let new_image = "";

    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    })
      .exec()
      .then((result) => {
        req.session.message = {
          type: "success",
          message: "User updated successfully!",
        };
        res.redirect("/home");
      })
      .catch((err) => {
        res.status(500).json({ message: err.message, type: "danger" });
      });
  });
};
const editUsers = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      res.render("editUser", {
        user: user,
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/");
    });
};
const deleteUsers = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (user.image !== "") {
      fs.unlinkSync(`./uploads/${user.image}`, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error deleting image" });
        }
        console.log("Image deleted successfully");
      });
    }

    req.session.message = {
      type: "info",
      message: "User deleted successfully",
    };
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  homePage,
  detailUsers,
  addUsers,
  addUsersPage,
  updateUsers,
  editUsers,
  deleteUsers,
};
