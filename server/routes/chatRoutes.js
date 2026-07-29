const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controller/chatRequestController.js");
const userAuth = require("../middlewares/userAuth.js");

chatRouter.post("/send-request",userAuth, chatController.sendRequest);
chatRouter.post("/receive-pending-request",userAuth, chatController.recivePendingRequest);
chatRouter.post("/receive-accepted-request",userAuth, chatController.reciveAcceptedRequest);
module.exports = chatRouter;