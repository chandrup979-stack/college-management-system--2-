const express = require("express");
const router = express.Router();
const { setDayOrder, getDayOrder, getUpcoming } = require("../controllers/dayOrderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), setDayOrder);
router.get("/upcoming", protect, getUpcoming);
router.get("/", protect, getDayOrder);

module.exports = router;