const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true }, 
    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("School", schoolSchema);
