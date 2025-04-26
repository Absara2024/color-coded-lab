const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  fileName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
