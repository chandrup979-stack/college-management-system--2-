const express = require("express");
const router = express.Router();
const {
  register,
  registerStudent,
  registerFaculty,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/register/student", registerStudent);
router.post("/register/faculty", registerFaculty);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;