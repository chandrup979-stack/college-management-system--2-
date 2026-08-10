const express = require("express");
const router = express.Router();
const {
  applyOutPass,
  getMyOutPasses,
  getAllOutPasses,
  reviewOutPass,
} = require("../controllers/outPassController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("student", "faculty"), applyOutPass);
router.get("/me", protect, getMyOutPasses);
router.get("/", protect, authorize("admin"), getAllOutPasses);
router.put("/:id/review", protect, authorize("admin"), reviewOutPass);

module.exports = router;