const mongoose = require("mongoose");

const dayOrderCalendarSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // "YYYY-MM-DD"
    dayOrder: { type: String, required: true }, // e.g. "Day 1" or "Holiday"
  },
  { timestamps: true }
);

module.exports = mongoose.model("DayOrderCalendar", dayOrderCalendarSchema);