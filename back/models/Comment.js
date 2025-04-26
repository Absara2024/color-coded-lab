const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
    user: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
    user: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    replies: [ReplySchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
