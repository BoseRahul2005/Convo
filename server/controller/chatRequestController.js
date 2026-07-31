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

        //checking if request already exists or is accepted
        const existing = await ChatRequest.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
            status: { $in: ["pending", "accepted"] } //if the status of the document is pending or accepted
        });

        if (existing) {
            return res.json({ success: false, message: "Request already exists" });
        }

        const chatRequest = new ChatRequest({ sender, receiver });
        await chatRequest.save();
        res.json({ success: true, message: "Chat request sent successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.pendingRequest = async (req, res) => {
    const sender = req.userId;
    try {
        //This reads as: "find every pending request where either I'm the sender or I'm the receiver."
        const pendingRequests = await ChatRequest.find({
            status: "pending", //filter out by pending status
            $or: [
                { sender: sender }, //filters if the logged in user is sender or,
                { receiver: sender } //filters if the logged in user is receiver
            ]
        })
            .populate("sender receiver", "username name _id email");
        res.json({ success: true, pendingRequests });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}
exports.sentRequestsCancel=async(req,res)=>{
    const {requestId}=req.params;
    try {
        const chatRequest = await ChatRequest.findByIdAndDelete(requestId);
        if(!chatRequest){
            return res.json({ success: false, message: "Chat request not found" });
        }
        res.json({ success: true, message: "Request cancelled successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.requestReject=async(req,res)=>{
    const {requestId}=req.params;
    try {
        const chatRequest = await ChatRequest.findByIdAndDelete(requestId);
        if(!chatRequest){
            return res.json({ success: false, message: "Chat request not found" });
        }
        res.json({ success: true, message: "Request rejected successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.reciveAcceptedRequest = async (req, res) => {
    try {
        const acceptedRequests = await ChatRequest.find({ status: "accepted" })
            .populate("sender", "username name _id email");
        res.json({ success: true, acceptedRequests });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

