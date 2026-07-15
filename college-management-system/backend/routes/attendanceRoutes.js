const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendanceBySubject,
  getStudentAttendance,
  getMyAttendance,
} = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/mark", protect, authorize("faculty"), markAttendance);
router.get("/subject/:subjectId", protect, authorize("faculty", "admin"), getAttendanceBySubject);
router.get("/student/:studentId", protect, authorize("faculty", "admin"), getStudentAttendance);
router.get("/me", protect, authorize("student"), getMyAttendance);

module.exports = router;