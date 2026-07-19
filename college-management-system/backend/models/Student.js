const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    year: { type: String, enum: ["1st Year", "2nd Year", "3rd Year"] },
    batch: { type: String },
    parentContact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);