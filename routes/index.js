const loginRoutes = require("./login");
const express = require("express");
const router = express.Router();
const constructorMethod = app => {
    //app.use("/", loginRoutes);
  
    app.use("*", (req, res) => {
      res.status(404).json({ error: "Page Does not Exist" });
    });
  
  };
  
  module.exports = constructorMethod;
