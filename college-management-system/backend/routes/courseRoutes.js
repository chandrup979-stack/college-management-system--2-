const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getCourses) // public - needed for signup forms
  .post(protect, authorize("admin"), createCourse);

router
  .route("/:id")
  .get(getCourseById)
  .put(protect, authorize("admin"), updateCourse)
  .delete(protect, authorize("admin"), deleteCourse);

module.exports = router;