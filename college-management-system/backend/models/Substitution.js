const mongoose = require("mongoose");

const substitutionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // "YYYY-MM-DD"
    dayOrder: { type: String, required: true },
    periodNumber: { type: Number, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    year: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    originalFaculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    substituteFaculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    reason: { type: String },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Substitution", substitutionSchema);