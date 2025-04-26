const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, user, imageUrl } = req.body;

    if (!text || !user) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newComment = new Comment({ text, user, imageUrl: imageUrl || null });
    await newComment.save();

    res.status(201).json({ message: 'Comment created', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
});

// Add a reply to a comment
router.post('/:id/reply', async (req, res) => {
  try {
    const { text, user } = req.body;
    const commentId = req.params.id;

    if (!text || !user) {
      return res.status(400).json({ message: 'Missing reply fields' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({ text, user });
    await comment.save();

    res.status(200).json({ message: 'Reply added', comment });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
});

module.exports = router;
