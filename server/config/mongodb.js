const mongoose = require("mongoose");
require("dotenv/config");

connectDB()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function connectDB() {
  // connect to MongoDB database named "convo"
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "convo",
  });
}

module.exports = connectDB;