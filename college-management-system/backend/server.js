require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const safeRequire = (relativePath) => {
  const fullPath = path.join(__dirname, relativePath);
  try {
    if (fs.existsSync(fullPath + ".js") || fs.existsSync(fullPath)) {
      return require(fullPath);
    }
  } catch (err) {
    // fall through
  }
  console.warn(`Optional module not found: ${relativePath}`);
  return null;
};

const authRoutes = safeRequire("./routes/authRoutes");
const departmentRoutes = safeRequire("./routes/departmentRoutes");
const courseRoutes = safeRequire("./routes/courseRoutes");
const userRoutes = safeRequire("./routes/userRoutes");
const subjectRoutes = safeRequire("./routes/subjectRoutes");
const attendanceRoutes = safeRequire("./routes/attendanceRoutes");
const marksRoutes = safeRequire("./routes/marksRoutes");
const assignmentRoutes = safeRequire("./routes/assignmentRoutes");
const leaveRoutes = safeRequire("./routes/leaveRoutes");
const timetableRoutes = safeRequire("./routes/timetableRoutes");
const announcementRoutes = safeRequire("./routes/announcementRoutes");
const statsRoutes = require("./routes/statsRoutes");

const mount = (routePath, router) => {
  if (router) app.use(routePath, router);
};

mount("/api/auth", authRoutes);
mount("/api/departments", departmentRoutes);
mount("/api/courses", courseRoutes);
mount("/api/users", userRoutes);
mount("/api/subjects", subjectRoutes);
mount("/api/attendance", attendanceRoutes);
mount("/api/marks", marksRoutes);
mount("/api/assignments", assignmentRoutes);
mount("/api/leave", leaveRoutes);
mount("/api/timetable", timetableRoutes);
mount("/api/announcements", announcementRoutes);
mount("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("Smart College Management System API is running...");
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
const net = require("net");

const findFreePort = (startPort, maxAttempts = 20) => {
  return new Promise((resolve, reject) => {
    let port = startPort;
    const tryListen = () => {
      const tester = net.createServer()
        .once("error", (err) => {
          tester.close();
          if (err.code === "EADDRINUSE") {
            port += 1;
            if (port - startPort > maxAttempts) return reject(new Error("No free ports available"));
            return tryListen();
          }
          reject(err);
        })
        .once("listening", () => {
          tester.close(() => resolve(port));
        })
        .listen(port);
    };

    tryListen();
  });
};

findFreePort(PORT)
  .then((freePort) => {
    app.listen(freePort, () => {
      console.log(`Server running on http://localhost:${freePort}`);
    });
  })
  .catch((err) => {
    console.error("Failed to find free port:", err.message || err);
    process.exit(1);
  });