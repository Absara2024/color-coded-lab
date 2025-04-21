const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const commentRoutes = require("./routes/CommentRoutes");
const graduateRoutes = require("./routes/graduateRoutes");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI) 
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user-comments", CommentRoutes);
app.use("/api/graduationRecords", graduateRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));