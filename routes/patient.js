const express = require("express");
const router = express.Router();
const Patient= require('../models/Patient')
const { body, validationResult } = require("express-validator");
const fetchDoctor = require("../middleware/fetchDoctor");
const Report= require('../models/Report')

router.post(
    "/register",
    fetchDoctor,
    [
      body("name", "Enter a valid title").isLength({ min: 3 }),
      body("phone", "Enter phone no").isLength({ min:10, max:10 }),
    ],
    async (req, res) => {
      try {
        const { name, phone } = req.body;
        // error handling and sending bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const patient = new Patient({
          name,
          phone,
          });
        const savepatient = await patient.save();
  
        res.json(savepatient);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("error occured");
      }
    }
  );

  router.post(
    "/:id/create_report",
    fetchDoctor,
    [
      // body("status", "Status field is required"),
      body("status", "Status should be either of these: Negative, Travelled-Quarantine, Symptoms-Quarantine, Positive-Admit").isIn([
        "Negative",
        "Travelled-Quarantine",
        "Symptoms-Quarantine",
        "Positive-Admit",
      ]).notEmpty(),
    ],
    async (req, res) => {
      try {
        console.log(req.params.id)
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
          return res.status(404).json({ error: "Patient not found" });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const report = new Report({
          patient: req.params.id,
          doctor: req.doctor.id,
          status: req.body.status,
        });
        const savedReport = await report.save();
        res.json(savedReport);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Error occurred");
      }
    }
  );

  router.get("/:id/all_reports", async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      const reports = await Report.find({ patient: req.params.id })
        .populate("doctor", "name")
        .select("-patient -__v")
        .sort({ createdAt: 1 }); // sort by oldest report first
      res.json(reports);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error occurred");
    }
  });

  router.get("/reports/:status", async (req, res) => {
    try {
        const reports = await Report.find({ status: req.params.status })
        .sort({ createdAt: 1 })
        .populate("doctor", "name")
        // .populate("patient", "name phone")
        // .select("-__v");
  
      res.json(reports);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error occurred");
    }
  });

module.exports = router;
