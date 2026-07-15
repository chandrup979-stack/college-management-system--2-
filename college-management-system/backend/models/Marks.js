const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    examType: {
      type: String,
      enum: ["internal1", "internal2", "final"],
      required: true,
    },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marks", marksSchema);