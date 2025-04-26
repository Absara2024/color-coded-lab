const mongoose = require("mongoose");

const graduateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, },
  graduationYear: { type: Number, required: true, },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School", 
    required: true,
  },
  cclYear: { type: Number, required: true, },
}, {
  timestamps: true, 
});

module.exports = mongoose.model("Graduate", graduateSchema);
