require('dotenv').config();
const express = require("express");
const Doctor = require("../models/Doctor");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchDoctor = require("../middleware/fetchDoctor");

const JWT_SECRET = process.env.JWT_SECRET;

// Create a doctor using POST
router.post("/register",[
  body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter valid email address").isEmail(),
    body("password").isLength({ min: 8 }),
] ,
async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let doctor = await Doctor.findOne({ email: req.body.email });
      if (doctor) {
        return res
          .status(400)
          .json({ error: "user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      doctor = await Doctor.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json(authtoken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("error occured");
    }
  }
);
router.post(
  "/login",
  [
    body("email", "Enter valid email address").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //  validating email and password of user
    const { email, password } = req.body;
    try {
      let doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(400).json({ error: "Wrong credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, doctor.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Wrong credentials" });
      }
      // sending data of user
      const data = {
        doctor: {
          id: doctor.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json(authtoken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
