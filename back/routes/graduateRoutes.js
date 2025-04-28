const express = require("express");
const Graduate = require("../models/Graduate");
const School = require("../models/School");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const graduationRecords = await Graduate.find().populate("school");

    const modifiedGraduationRecords = graduationRecords.map((record) => ({
      ...record.toObject(),
      school: {
        ...record.school.toObject(),
        location: record.school.location || "Unknown Location",
      },
    }));

    res.status(200).json({ graduationRecords: modifiedGraduationRecords });
  } catch (error) {
    console.error("Error fetching graduation records:", error);
    res.status(500).json({ message: "Error fetching graduation records", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const graduationRecord = await Graduate.findById(req.params.id).populate("school");

    if (!graduationRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      graduationRecord: {
        ...graduationRecord.toObject(),
        school: {
          ...graduationRecord.school.toObject(),
          location: graduationRecord.school.location || "Unknown Location",
        },
      },
    });
  } catch (error) {
    console.error("Invalid ID format:", error);
    res.status(400).json({ message: "Invalid ID format", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, graduationYear, schoolName, cclYear, photoUrl } = req.body;

    if (!name || !graduationYear || !schoolName || !cclYear) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const school = await School.findOne({ name: schoolName });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const newGraduate = new Graduate({
      name,
      graduationYear,
      cclYear,
      school: school._id,
      photoUrl: photoUrl || null,
    });

    const savedGraduate = await newGraduate.save();

    const populatedGraduate = await Graduate.findById(savedGraduate._id).populate("school");

    res.status(201).json({
      message: "Graduate created",
      graduate: {
        ...populatedGraduate.toObject(),
        school: {
          ...populatedGraduate.school.toObject(),
          location: populatedGraduate.school.location || "Unknown Location", 
        },
      },
    });
  } catch (error) {
    console.error("Graduate creation failed:", error);
    res.status(500).json({ message: "Failed to create graduation record", error });
  }
});

router.get("/school/:schoolName", async (req, res) => {
  try {
    const school = await School.findOne({
      name: { $regex: new RegExp("^" + req.params.schoolName.trim() + "$", "i") },
    });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const graduates = await Graduate.find({ school: school._id }).populate("school");

    if (!graduates.length) {
      return res.status(404).json({ message: "No graduates found for this school" });
    }

    const modifiedGraduates = graduates.map((graduate) => ({
      ...graduate.toObject(),
      school: {
        ...graduate.school.toObject(),
        location: graduate.school.location || "Unknown Location", 
      },
    }));

    res.status(200).json(modifiedGraduates);
  } catch (error) {
    console.error("Error fetching graduates by school name:", error);
    res.status(500).json({ message: "Error fetching graduates by school", error });
  }
});

module.exports = router;
