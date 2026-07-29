const ChatRequest = require("../models/chatRequestModel.js");

exports.sendRequest = async (req, res) => {
    const sender = req.userId;
    const { receiver } = req.body;

    try {
        if (!receiver) {
            return res.json({ success: false, message: "Receiver ID is required" });
        }

        if (sender === receiver) {
            return res.json({ success: false, message: "Cannot send a request to yourself" });
        }

        const existing = await ChatRequest.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
            status: { $in: ["pending", "accepted"] }
        });

        if (existing) {
            return res.json({ success: false, message: "Request already exists" });
        }

        const chatRequest = new ChatRequest({ sender, receiver });
        await chatRequest.save();
        res.json({ success: true, message: "Chat request sent successfully" });
        console.log(chatRequest);
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.recivePendingRequest = async (req, res) => {
    try {
        const pendingRequests = await ChatRequest.find({status: "pending"})
            .populate("sender", "username name _id email");
        res.json({ success: true, pendingRequests });
        console.log(pendingRequests);
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.reciveAcceptedRequest = async (req, res) => {
    try {
        const acceptedRequests = await ChatRequest.find({status: "accepted"})
            .populate("sender", "username name _id email");
        res.json({ success: true, acceptedRequests });
        console.log(acceptedRequests);
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

