const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controller/chatRequestController.js");
const userAuth = require("../middlewares/userAuth.js");

chatRouter.post("/send-request", userAuth, chatController.sendRequest);
chatRouter.post("/pending-request", userAuth, chatController.pendingRequest);
chatRouter.delete("/sent-request-cancel/:requestId", userAuth, chatController.sentRequestsCancel);
chatRouter.delete("/request-reject/:requestId", userAuth, chatController.requestReject);
chatRouter.post("/accept-request/:requestId", userAuth, chatController.acceptRequest);
chatRouter.get("/contacts", userAuth, chatController.getContacts);


module.exports = chatRouter;