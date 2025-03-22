const express = require("express");
const Graduate = require("../models/Graduate");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, graduationYear, school, cclYear } = req.body;
    const graduate = new Graduate({ name, graduationYear, school, cclYear });
    await graduate.save();
    res.status(201).json(graduate);
  } catch (error) {
    res.status(500).json({ message: "Error adding graduate", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const graduates = await Graduate.distinct('school');
    res.json(graduates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error });
  }
});

router.get("/school/:school", async (req, res) => {
  try {
    const school = req.params.school;
    const graduates = await Graduate.find({ school: school });
    res.json(graduates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching graduates by school", error });
  }
});

module.exports = router;
