const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controller/chatRequestController.js");
const userAuth = require("../middlewares/userAuth.js");

chatRouter.post("/send-request", userAuth, chatController.sendRequest);
chatRouter.post("/pending-request", userAuth, chatController.pendingRequest);
chatRouter.post("/receive-accepted-request", userAuth, chatController.reciveAcceptedRequest);
chatRouter.delete("/sent-request-cancel/:requestId", userAuth, chatController.sentRequestsCancel);
chatRouter.delete("/request-reject/:requestId", userAuth, chatController.requestReject);

module.exports = chatRouter;