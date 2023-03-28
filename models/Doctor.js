const mongoose = require("mongoose");
const { Schema } = mongoose;

const DoctorScehma = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Doctor = mongoose.model("doctor", DoctorScehma);
Doctor.createIndexes();
module.exports = Doctor;
