require("dotenv").config();
// const express = require("express");

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser"; // Import cookie-parser
import configViewEnginee from "./config/viewEnginee";
import initWebRoute from "./routes/routes";
import initAPIRoute from "./routes/routesAPI";
import { createJWT } from "./middleware/jwtAction";
import { verifyToken } from "./middleware/jwtAction";
const app = express();
const PORT = process.env.PORT || 4000;

// Integrate cookie-parser middleware
app.use(cookieParser());
// database connection
const MONGOURL = process.env.MONGO_URL;
mongoose.connect(MONGOURL).then(() => {
  console.log("Database is connected successfully");
});

// set template engine
configViewEnginee(app);

//milddlewares
//ExpressJs khi hoạt động sẽ là một loạt các hàm Middleware được thực hiện liên tiếp nhau.
//Sau khi đã thiết lập, các request từ phía người dùng khi gửi lên ExpressJS sẽ thực hiện lần lượt qua các hàm Middleware cho đến khi trả về response cho người dùng.
// Các hàm này sẽ được quyền truy cập đến các đối tượng đại diện cho Request – req, Response – res, hàm Middleware tiếp theo – next, và đối tượng lỗi – err nếu cần thiết.
//Một hàm Middleware sau khi hoạt động xong, nếu chưa phải là cuối cùng trong chuỗi các hàm cần thực hiện, sẽ cần gọi lệnh next() để chuyển sang hàm tiếp theo,
// bằng không xử lý sẽ bị treo tại hàm đó.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });
//test jwt
createJWT();
let decodedData = verifyToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmluIiwiYWRkcmVzcyI6ImhjbSIsImlhdCI6MTcxNjI3ODg3NH0.iz9OK4J9kXzKsRuPYgMjhzU-S5NglnMUks04Nl9K30c"
);
console.log(decodedData);

//initWebRoute
initWebRoute(app);
//initAPIRoute
initAPIRoute(app);

// Handle 404 not found
app.use((req, res) => {
  return res.render("404.ejs");
});
app.listen(PORT, () => {
  console.log(`Server is running on port at http://localhost:${PORT}`);
});
