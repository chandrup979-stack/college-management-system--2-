const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getDepartments) // public - needed for signup forms
  .post(protect, authorize("admin"), createDepartment);

router
  .route("/:id")
  .get(getDepartmentById)
  .put(protect, authorize("admin"), updateDepartment)
  .delete(protect, authorize("admin"), deleteDepartment);

module.exports = router;