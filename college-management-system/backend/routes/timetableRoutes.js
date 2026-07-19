const express = require("express");
const router = express.Router();
const {
  upsertTimetable,
  getTimetable,
  getMyTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/me", protect, authorize("student"), getMyTimetable);

router
  .route("/")
  .get(protect, getTimetable)
  .post(protect, authorize("admin"), upsertTimetable);

router.delete("/:id", protect, authorize("admin"), deleteTimetable);

module.exports = router;