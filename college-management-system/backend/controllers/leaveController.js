const LeaveRequest = require("../models/LeaveRequest");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

const applyLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can apply for leave" });
    }

    const leave = await LeaveRequest.create({
      student: student._id,
      reason,
      fromDate,
      toDate,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLeaveRequests = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const leaves = await LeaveRequest.find({ student: student._id })
      .populate({ path: "reviewedBy", populate: { path: "user", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLeaveRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const leaves = await LeaveRequest.find(filter)
      .populate({ path: "student", populate: { path: "user", select: "name email" } })
      .populate({ path: "reviewedBy", populate: { path: "user", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewLeave = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'approved' or 'rejected'" });
    }

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can review leave requests" });
    }

    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: faculty._id },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaveRequests,
  getAllLeaveRequests,
  reviewLeave,
};