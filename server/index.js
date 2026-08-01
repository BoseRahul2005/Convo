require("dotenv/config");
const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/mongodb.js");
const router = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const chatRouter = require("./routes/chatRoutes.js");
const { initSocket } = require("./config/socket.js");

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// API routes
app.get("/", (req, res) => {
    res.send("root is working");
});

app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// Wrap the Express app in a raw HTTP server
const server = http.createServer(app);

// Attach Socket.IO to that same server
const io = initSocket(server);

server.listen(port, () => {
    console.log(`server is listening on port ${port}...`);
});