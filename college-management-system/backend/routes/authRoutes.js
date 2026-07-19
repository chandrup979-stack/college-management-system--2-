const express = require("express");
const router = express.Router();
const { register, registerStudent, registerFaculty, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/register/student", registerStudent);
router.post("/register/faculty", registerFaculty);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;