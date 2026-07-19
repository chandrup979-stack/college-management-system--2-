const express = require("express");
const router = express.Router();
const { getAdminStats, getFacultyStats } = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin", protect, authorize("admin"), getAdminStats);
router.get("/faculty", protect, authorize("faculty"), getFacultyStats);

module.exports = router;