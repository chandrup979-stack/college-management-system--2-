const OutPass = require("../models/OutPass");

// @route  POST /api/outpass
// @desc   Student or faculty requests an out-pass
const applyOutPass = async (req, res) => {
  try {
    const { reason, date, outTime, expectedInTime } = req.body;

    const outPass = await OutPass.create({
      requestedBy: req.user._id,
      requesterRole: req.user.role,
      reason,
      date,
      outTime,
      expectedInTime,
    });

    res.status(201).json(outPass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/outpass/me
// @desc   Logged-in user views their own out-pass requests
const getMyOutPasses = async (req, res) => {
  try {
    const outPasses = await OutPass.find({ requestedBy: req.user._id })
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });
    res.json(outPasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/outpass?status=pending
// @desc   Admin views all out-pass requests (optionally filtered by status)
const getAllOutPasses = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const outPasses = await OutPass.find(filter)
      .populate("requestedBy", "name email role")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });
    res.json(outPasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/outpass/:id/review
// @desc   Admin approves or rejects an out-pass
const reviewOutPass = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'approved' or 'rejected'" });
    }

    const outPass = await OutPass.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user._id },
      { new: true }
    );

    if (!outPass) {
      return res.status(404).json({ message: "Out-pass request not found" });
    }

    res.json(outPass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyOutPass, getMyOutPasses, getAllOutPasses, reviewOutPass };