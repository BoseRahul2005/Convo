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