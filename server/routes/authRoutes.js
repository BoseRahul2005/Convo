const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const userAuth = require("../middlewares/userAuth.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/send-verify-otp",userAuth, authController.sendVerifyOtp);
router.post("/verify-otp",userAuth, authController.verifyEmail);

module.exports = router;