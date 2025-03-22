const mongoose = require("mongoose");

const GraduateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  school: { type: String, required: true },
  cclYear: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Graduate", GraduateSchema);
