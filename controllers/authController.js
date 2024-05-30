const auths = require("../models/auths");
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";

const login = (req, res) => {
  return res.render("login");
};
const loginSuccess = async (req, res) => {
  try {
    const check = await auths.findOne({ username: req.body.username });
    if (!check) {
      return res.send("User name cannot found"); // Add return here
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      // Tạo JWT
      let key = process.env.JWT_SECRET;
      const token = jwt.sign(
        { userId: check._id, username: check.username },
        key,
        { expiresIn: "1h" }
      );
      // Gửi JWT về cho client
      res.cookie("token", token, { httpOnly: true }); // Lưu trữ JWT trong cookie, có thể lựa chọn lưu trữ ở đây hoặc local storage
      res.redirect("/home");
    } else {
      res.send("Wrong password");
    }
  } catch {
    res.send("Wrong details");
  }
};

const registerPage = (req, res) => {
  return res.render("signup");
};

const register = async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };

    const existingUser = await auths.findOne({ username: data.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      // Hash the password using bcrypt
      const saltRounds = 10; // Number of salt rounds for bcrypt
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword; // Replace the plain password with the hashed one
    }

    const auth = await auths.create(data);
    res.redirect("/");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

module.exports = {
  login,
  register,
  registerPage,
  loginSuccess,
};
