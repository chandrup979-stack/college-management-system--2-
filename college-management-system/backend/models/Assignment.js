const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    fileUrl: { type: String },
    dueDate: { type: Date },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        fileUrl: { type: String },
        submittedAt: { type: Date },
        grade: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);