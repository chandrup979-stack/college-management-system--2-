const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaveRequests,
  getAllLeaveRequests,
  reviewLeave,
} = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("student"), applyLeave);
router.get("/me", protect, authorize("student"), getMyLeaveRequests);
router.get("/", protect, authorize("faculty", "admin"), getAllLeaveRequests);
router.put("/:id/review", protect, authorize("faculty"), reviewLeave);

module.exports = router;