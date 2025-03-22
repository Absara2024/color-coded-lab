const express = require("express");
const Graduate = require("../models/Graduate");

const router = express.Router();

// Add a graduate
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

// Get all graduates
router.get("/", async (req, res) => {
  try {
    const graduates = await Graduate.find();
    res.json(graduates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching graduates", error });
  }
});

module.exports = router;
