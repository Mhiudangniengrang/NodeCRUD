import express from "express";
import APIController from "../controllers/APIController";

const router = express.Router();

const initAPIRoute = (app) => {
  //C-R-U-D
  router.get("/users", APIController.getAllUsers); //method GET => READ data
  router.post("/create_users", APIController.createNewUser); //method POST => CREATE data
  router.put("/update_users/:id", APIController.updateUsers);// method PUT => UPDATE data
  router.delete("/delete_users/:id", APIController.deleteUser);// method DELETE => DELETE data
  return app.use("/api/v1", router);
};

module.exports = initAPIRoute;
