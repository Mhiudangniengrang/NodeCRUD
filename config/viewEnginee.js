import express from "express";

const configViewEngine = (app) => {
  app.use(express.static("uploads"));
  app.set("view engine", "ejs");
  app.set("views", ["views", "views/auth"]); // Sử dụng mảng để chỉ định cả hai thư mục views.
};

export default configViewEngine;
