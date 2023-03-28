require('dotenv').config();
const mongoose = require("mongoose");


const connectToMongo = async () => {

  try {
    await mongoose.connect(process.env.mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectToMongo;