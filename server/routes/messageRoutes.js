const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controller/messageController.js");
const userAuth = require("../middlewares/userAuth.js");

messageRouter.post("/send-message/:receiverId", userAuth, messageController.sendMessage);
messageRouter.get("/all-messages/:contactId",userAuth,messageController.allMessages);
messageRouter.put("/mark-seen/:contactId",userAuth,messageController.seenMessage);

module.exports = messageRouter;