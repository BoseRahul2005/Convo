const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController.js");
const userAuth = require("../middlewares/userAuth.js");

userRouter.get("/details",userAuth, userController.userDetails);

module.exports = userRouter;