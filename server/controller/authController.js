const User=require("../models/userModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const transporter=require("../config/nodemailer.js");

//for registering a new user
exports.register=async (req, res) => {
    const { username,name, email, password } = req.body;
    if(!username || !name || !email || !password){
        return res.json({success:false, message:"All fields are required"});
    }

    //when we get all the fields, we will check if the user already exists or not
    try{
        //checking if user already exists in the db by finding the user by email
        const existingUser = await User.findOne({ email });
        if(existingUser){
            //if user already exists, we will return an error message
            return res.json({success:false, message:"User already exists"});
        }
        const hashedPassword=bcrypt.hashSync(password, 10); //hashing the password before saving it to the database

        //if user doesn't exist, we will create a new user object and save it to the database
        const newUser=new User({
            username,
            name,
            email,
            password:hashedPassword,
        });
        await newUser.save();
        
        const token=jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
        
        res.cookie("token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000, // 7 days
        });

        // Send welcome email
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: newUser.email,
            subject: "Welcome to Convo!",
            text: `Hello ${newUser.name},\n\nThank you for registering with us! We're excited to have you on board.\n\nWake up your Beast in the chat..`
        };
        await transporter.sendMail(mailOptions);

        res.json({success:true, message:"Registered successfully"});

    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.login=async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.json({success:false, message:"All fields are required"});
    }

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        const isPasswordCorrect=bcrypt.compareSync(password, user.password);
        if(!isPasswordCorrect){
            return res.json({success:false, message:"Incorrect password"});
        }

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie("token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000, // 7 days
        });

        res.json({success:true, message:"logged in successfully"});
    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.logout=async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
        });
        res.json({success:true, message:"logged out successfully"});
    }catch(err){
        res.json({success:false, message:err.message});
    }
}