const express = require("express");
const path = require("path");
const connectDB = require("./config/mongodb.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
require("dotenv/config");

const app = express();
const port = process.env.PORT || 8080;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

//API routes
app.get("/", (req, res) => {
    res.send("root is working");
});

app.use("/api/auth", router);
app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`server is listening on port ${port}...`);
})