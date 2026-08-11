const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const Course = require("../models/Course");
const LeaveRequest = require("../models/LeaveRequest");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");

const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalDepartments, totalCourses, pendingLeaves] =
      await Promise.all([
        Student.countDocuments(),
        Faculty.countDocuments(),
        Department.countDocuments(),
        Course.countDocuments(),
        LeaveRequest.countDocuments({ status: "pending" }),
      ]);

    const students = await Student.find().populate("user", "department name");
    const departments = await Department.find();

    const deptCounts = departments.map((d) => ({
      name: d.name,
      count: students.filter((s) => s.user?.department?.toString() === d._id.toString()).length,
    }));

    const years = ["1st Year", "2nd Year", "3rd Year"];
    const yearCounts = years.map((y) => ({
      year: y,
      count: students.filter((s) => s.year === y).length,
    }));

    // --- Attendance shortage calculation ---
    const allAttendance = await Attendance.find().populate("subject", "name code");

    // Group by student, then by subject, to compute per-subject percentage
    const byStudent = {};
    allAttendance.forEach((a) => {
      const sid = a.student.toString();
      if (!byStudent[sid]) byStudent[sid] = {};
      const subjId = a.subject?._id?.toString() || "unknown";
      if (!byStudent[sid][subjId]) {
        byStudent[sid][subjId] = { total: 0, present: 0, subjectName: a.subject?.name || "Unknown" };
      }
      byStudent[sid][subjId].total += 1;
      if (a.status === "present") byStudent[sid][subjId].present += 1;
    });

    const shortageList = [];
    students.forEach((s) => {
      const records = byStudent[s._id.toString()];
      if (!records) return;

      let totalClasses = 0;
      let totalPresent = 0;
      const lowSubjects = [];

      Object.values(records).forEach((r) => {
        totalClasses += r.total;
        totalPresent += r.present;
        const pct = Math.round((r.present / r.total) * 100);
        if (pct < 75) lowSubjects.push({ subject: r.subjectName, percentage: pct });
      });

      const overallPct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 100;

      if (overallPct < 75) {
        shortageList.push({
          studentId: s._id,
          name: s.user?.name,
          rollNumber: s.rollNumber,
          year: s.year,
          overallPercentage: overallPct,
          lowSubjects,
        });
      }
    });

    shortageList.sort((a, b) => a.overallPercentage - b.overallPercentage);

    res.json({
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      pendingLeaves,
      studentsByDepartment: deptCounts,
      studentsByYear: yearCounts,
      attendanceShortage: shortageList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFacultyStats = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can view this" });
    }

    const [assignmentsCreated, pendingLeaves] = await Promise.all([
      Assignment.countDocuments({ faculty: faculty._id }),
      LeaveRequest.countDocuments({ status: "pending" }),
    ]);

    res.json({ assignmentsCreated, pendingLeaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getFacultyStats };