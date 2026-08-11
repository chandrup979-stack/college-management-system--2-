const express = require("express");
const router = express.Router();
const {
  createStudent,
  bulkCreateStudents,
  createFaculty,
  getStudents,
  getFaculty,
  updateStudent,
  updateFaculty,
  deleteStudent,
  deleteFaculty,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/students")
  .get(protect, authorize("admin", "faculty"), getStudents)
  .post(protect, authorize("admin"), createStudent);

router.post("/students/bulk", protect, authorize("admin"), bulkCreateStudents);

router
  .route("/faculty")
  .get(protect, authorize("admin"), getFaculty)
  .post(protect, authorize("admin"), createFaculty);

router.put("/students/:id", protect, authorize("admin"), updateStudent);
router.put("/faculty/:id", protect, authorize("admin"), updateFaculty);
router.delete("/students/:id", protect, authorize("admin"), deleteStudent);
router.delete("/faculty/:id", protect, authorize("admin"), deleteFaculty);

module.exports = router;