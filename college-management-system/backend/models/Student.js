const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    semester: { type: Number },
    batch: { type: String },
    parentContact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);