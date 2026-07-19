const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAllAssignments, getMyAssignments } = require("../controllers/assignmentController");

router.get("/", protect, authorize("faculty"), getAllAssignments);
router.get("/me", protect, authorize("student"), getMyAssignments);

module.exports = router;
