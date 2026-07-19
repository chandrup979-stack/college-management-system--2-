const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    year: { type: String, enum: ["1st Year", "2nd Year", "3rd Year"] },
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

module.exports = mongoose.model("Timetable", timetableSchema);