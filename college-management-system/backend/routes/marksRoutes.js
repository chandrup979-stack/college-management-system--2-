const express = require("express");
const router = express.Router();
const {
  enterMarks,
  enterMarksBulk,
  getMarksBySubject,
  getStudentMarks,
  getMyMarks,
} = require("../controllers/marksController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("faculty"), enterMarks);
router.post("/bulk", protect, authorize("faculty"), enterMarksBulk);
router.get("/subject/:subjectId", protect, authorize("faculty", "admin"), getMarksBySubject);
router.get("/student/:studentId", protect, authorize("faculty", "admin"), getStudentMarks);
router.get("/me", protect, authorize("student"), getMyMarks);

module.exports = router;