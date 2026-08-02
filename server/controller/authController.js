const User=require("../models/userModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const brevo = require("../config/nodemailer.js");

// small helper so we don't repeat this shape in every function
const sendEmail = async ({ to, subject, text }) => {
    return brevo.transactionalEmails.sendTransacEmail({
        sender: { name: "Convo", email: process.env.SENDER_MAIL },
        to: [{ email: to }],
        subject: subject,
        textContent: text
    });
}

//for registering a new user
exports.register=async (req, res) => {
    const { username,name, email, password } = req.body;
    if(!username || !name || !email || !password){
        return res.json({success:false, message:"All fields are required"});
    }

    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.json({success:false, message:"User already exists"});
        }
        const hashedPassword=bcrypt.hashSync(password, 10);

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
            maxAge:7*24*60*60*1000,
        });

        res.json({success:true, message:"Registered successfully"});

        // Send welcome email in the background
        sendEmail({
            to: newUser.email,
            subject: "Welcome to Convo!",
            text: `Hello ${newUser.name},\n\nThank you for registering with us! We're excited to have you on board.\n\nWake up your Beast in the chat..`
        }).catch(err => {
            console.log("Welcome email failed to send:", err.message);
        });

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
            maxAge:7*24*60*60*1000,
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

exports.sendVerifyOtp=async (req, res) => {
    let { userId} = req.body;   
    user=await User.findById(userId);

    if(user.isAccountVerified){
        return res.json({success:false, message:"Account is already verified"});
    }

    try{
        let otp=Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now()+10*60*1000;

        await sendEmail({
            to: user.email,
            subject: "Verify your email",
            text: `Hello ${user.name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`
        });
        await user.save();
        res.json({success:true, message:"OTP sent successfully"});

    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.verifyEmail=async (req, res) => {
    let { userId, otp } = req.body;   
    user=await User.findById(userId);

    if(!user||!otp){
        return res.json({success:false, message:"Missing Details"});
    }

    try{
        const user=await User.findById(userId);

        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        if(user.verifyOtp===''||user.verifyOtp!==otp){
            return res.json({success:false, message:"Invalid OTP"});
        }

        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false, message:"OTP expired"});
        }
        user.isAccountVerified=true;

        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();
        res.json({success:true, message:"Email verified successfully"});
    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.isAuthenticated=async (req, res) => {
    try{
        res.json({success:true, message:"User is authenticated"});
    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.resetPassOtp=async (req, res) => {
    let {email} = req.body;   
    if(!email){
        return res.json({success:false, message:"Email is required"});
    }

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        let otp=Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+10*60*1000;
        
        await sendEmail({
            to: user.email,
            subject: "Reset your password",
            text: `Hello ${user.name},we are human and we can forget things\nDon't worry\nwe got you,\n\nYour password reset code is: ${otp}\n\nThis code will expire in 10 minutes.`
        });
        await user.save();
        res.json({success:true, message:"OTP sent to your email successfully"});
    }catch(err){
        res.json({success:false, message:err.message});
    }
}

exports.resetPassword=async (req, res) => {
    let {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false, message:"All fields are required"});
    }

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        if(user.resetOtp===''||user.resetOtp!==otp){
            return res.json({success:false, message:"Invalid OTP"});
        }
        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false, message:"OTP expired"});
        }
        const hashedPassword=bcrypt.hashSync(newPassword, 10);
        user.password=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();
        res.json({success:true, message:"Password reset successfully"});
    }catch(err){
        res.json({success:false, message:err.message});
    }
}