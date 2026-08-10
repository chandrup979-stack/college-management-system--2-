const mongoose = require("mongoose");

const outPassSchema = new mongoose.Schema(
  {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requesterRole: { type: String, enum: ["student", "faculty"], required: true },
    reason: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    outTime: { type: String, required: true }, // e.g. "11:30 AM"
    expectedInTime: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OutPass", outPassSchema);