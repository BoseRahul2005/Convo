const express =require("express");
const path=require("path");
const connectDB=require("./config/mongodb.js");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const router=require("./routes/authRoutes.js");
require("dotenv/config");

const app=express();
const port=process.env.PORT || 8080;
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

//API routes
app.get("/",(req,res)=>{
    res.send("root is working");
});

app.use("/api/auth", router);

app.listen(port,()=>{
    console.log(`server is listening on port ${port}...`);
})