const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    duration: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);