require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const statsRoutes = require("./routes/statsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dayOrderRoutes = require("./routes/dayOrderRoutes");
const substitutionRoutes = require("./routes/substitutionRoutes");
const outPassRoutes = require("./routes/outPassRoutes");

const app = express();

connectDB();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" })); // caps request body size
app.use(mongoSanitize()); // strips $ and . from user input to block NoSQL injection

// General rate limit: 300 requests per 15 min per IP, across the whole API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", generalLimiter);

// Stricter rate limit specifically on login/register: 10 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again in 15 minutes." },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/register/student", authLimiter);
app.use("/api/auth/register/faculty", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dayorder", dayOrderRoutes);
app.use("/api/substitutions", substitutionRoutes);
app.use("/api/outpass", outPassRoutes);

app.get("/", (req, res) => {
  res.send("Smart College Management System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});