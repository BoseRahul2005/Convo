const User=require("../models/userModel");

exports.userDetails=async (req, res) => {
    try{
        const {userId}=req;
        const user=await User.findById(userId);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        res.json({
            success:true,
            userData:{
                _id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                isAccountVerified:user.isAccountVerified
            }
        })
    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.findUser=async (req, res) => {
    try{
            const {query}=req.body;

            const users= await User.find({
                $or:[
                    {username:{ $regex: query, $options: "i"}},
                    {name:{ $regex: query, $options: "i"}},
                ]
            }).select("username name _id email");

            if(!users){
                return res.json({success:false, message:"No user found"});
            }

            return res.json({success:true,users});
    }catch(err){
        console.log(err);
        res.json({success:false, message:err.message});
    }
}