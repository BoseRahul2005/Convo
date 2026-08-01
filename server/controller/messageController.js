const Message = require("../models/messageModel");
const { getSocketIdByUserId, getIO } = require("../config/socket");

exports.sendMessage = async (req, res) => {
    const loggedInUser = req.userId
    const { receiverId } = req.params;
    const { text } = req.body;

    try {
        if (!receiverId || !text) {
            return res.json({ success: false, message: "Receiver ID and message are required" });
        }

        const newMessage = new Message({
            sender: loggedInUser,
            receiver: receiverId,
            text
        });

        await newMessage.save();

        const receiverSocketId = getSocketIdByUserId(receiverId);
        if (receiverSocketId) {
            getIO().to(receiverSocketId).emit("new_message", newMessage);
        }
        res.json({ success: true, newMessage });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

exports.allMessages= async(req,res)=>{
    const loggedInUser=req.userId;
    const {contactId}=req.params;
    try{
        if(!contactId){
            res.json({success:false,message:"Contact id required"})
        }
        const allMessages= await Message.find({
            $or:[
                {sender:loggedInUser,receiver:contactId},
                {sender:contactId,receiver:loggedInUser}
            ]
        }).sort({ createdAt: 1 }); // 1 means ascending order (oldest → newest). If I used -1 instead, that would mean descending (newest → oldest)
        if(!allMessages){
            res.json({success:false,message:"No messages yet!"});
        }
        res.json({success:true,allMessages});
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}