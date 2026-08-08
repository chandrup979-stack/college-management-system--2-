const express = require("express");
const router = express.Router();
const {
  getFreeFaculty,
  createSubstitution,
  getSubstitutions,
  getMySubstitutions,
  deleteSubstitution,
} = require("../controllers/substitutionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/free-faculty", protect, authorize("admin"), getFreeFaculty);
router.get("/me", protect, authorize("faculty"), getMySubstitutions);

router
  .route("/")
  .get(protect, authorize("admin"), getSubstitutions)
  .post(protect, authorize("admin"), createSubstitution);

router.delete("/:id", protect, authorize("admin"), deleteSubstitution);

module.exports = router;