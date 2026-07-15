const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    semester: { type: Number },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
