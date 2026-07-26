import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//for registering a new user
export const register=async (req, res) => {
    const { username,name, email, password } = req.body;
    if(!username || !name || !email || !password){
        return res.json({success:false, message:"All fields are required"});
    }

    //when we get all the fields, we will check if the user already exists or not
    try{
        //checking if user already exists in the db by finding the user by email
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.json({success:false, message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password, 10);

        const newUser=new User({
            username,
            name,
            email,
            password:hashedPassword,
        });
        await newUser.save();
        res.json({success:true, message:"User registered successfully"});

        const token=jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie("token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000, // 7 days
        });
    }catch(err){
        res.json({success:false, message:err.message});
    }
}