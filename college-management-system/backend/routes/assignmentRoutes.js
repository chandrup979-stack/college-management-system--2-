const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getMyAssignments,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/me", protect, authorize("student"), getMyAssignments);

router
  .route("/")
  .get(protect, getAssignments)
  .post(protect, authorize("faculty"), createAssignment);

router
  .route("/:id")
  .get(protect, getAssignmentById)
  .put(protect, authorize("faculty"), updateAssignment)
  .delete(protect, authorize("faculty"), deleteAssignment);

router.post("/:id/submit", protect, authorize("student"), submitAssignment);

module.exports = router;