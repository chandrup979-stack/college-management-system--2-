const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetRole: {
      type: String,
      enum: ["all", "students", "faculty"],
      default: "all",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);