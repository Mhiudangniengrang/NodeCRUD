import express from "express";
import homeControllers from "../controllers/homeControllers";
import { about } from "../controllers/about";
import { contact } from "../controllers/contact";
import authController from "../controllers/authController";
import { authenticateToken } from "../middleware/jwtAction";

const router = express.Router();

const initWebRoute = (app) => {
  // POST request to add user
  router.post("/add", homeControllers.addUsers);
  router.post("/update/:id", homeControllers.updateUsers);

  // GET request to render the add user page
  router.get("/home", authenticateToken, homeControllers.homePage);
  router.get("/add", authenticateToken, homeControllers.addUsersPage);
  router.get("/about", authenticateToken, about);
  router.get("/contact", authenticateToken, contact);
  // editUser
  router.get("/edit/:id", homeControllers.editUsers);
  //deleteUser
  router.get("/delete/:id", homeControllers.deleteUsers);
  //detailUser
  router.get("/detail/:id", homeControllers.detailUsers);
  //login
  router.get("/", authController.login);
  router.post("/", authController.loginSuccess);
  //signup
  router.get("/register", authController.registerPage);
  router.post("/register", authController.register);

  return app.use("/", router);
};

module.exports = initWebRoute;
