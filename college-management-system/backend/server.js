require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("Smart College Management System API is running...");
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = Number(port) + 1;
      console.warn(`Port ${port} is busy. Trying ${fallbackPort} instead...`);
      server.close(() => startServer(fallbackPort));
    } else {
      throw error;
    }
  });
};

const PORT = Number(process.env.PORT) || 5000;
startServer(PORT);