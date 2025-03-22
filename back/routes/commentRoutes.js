const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const comment = new Comment({ message });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

module.exports = router;
