const express = require("express");
const School = require("../models/School");
const Graduate = require("../models/Graduate");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ message: "Error fetching schools", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, location, address } = req.body;
    if (!name || !location || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSchool = new School({ name, location, address });
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({ message: "Failed to create school", error });
  }
});

router.get("/distinct", async (req, res) => {
  try {
    const schools = await Graduate.distinct("school");
    res.json(schools.map((schoolId) => ({ _id: schoolId, name: String(schoolId) })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching distinct schools", error });
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const school = await School.findOne({ name: req.params.name });
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: "Error fetching school", error: err });
  }
});

module.exports = router;
