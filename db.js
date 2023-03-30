require('dotenv').config();
const mongoose = require("mongoose");


const connectToMongo = async () => {

  try {
    await mongoose.connect("mongodb+srv://Lalit:123@cluster0.dwnwv8t.mongodb.net/Hospital-API");
    console.log("Connected to MongoDB");
  } catch (err) {y
    console.error(err);
  }
};

module.exports = connectToMongo;