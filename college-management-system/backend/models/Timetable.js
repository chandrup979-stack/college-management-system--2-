const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    year: { type: String, enum: ["1st Year", "2nd Year", "3rd Year"] },
    dayOrder: { type: String, required: true }, // e.g. "Day 1", "Day 2" ... "Day 6"
    periods: [
      {
        periodNumber: { type: Number },
        time: { type: String }, // e.g. "9:15 AM - 10:10 AM"
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
        label: { type: String }, // used instead of subject, e.g. "Lunch Break"
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);