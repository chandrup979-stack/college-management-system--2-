const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    semester: { type: Number },
    day: { type: String },
    slots: [
      {
        time: { type: String },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);