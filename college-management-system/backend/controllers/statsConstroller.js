const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const Course = require("../models/Course");
const LeaveRequest = require("../models/LeaveRequest");
const Assignment = require("../models/Assignment");

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

    const students = await Student.find().populate("user", "department");
    const departments = await Department.find();

    const deptCounts = departments.map((d) => ({
      name: d.name,
      count: students.filter((s) => s.user?.department?.toString() === d._id.toString()).length,
    }));

    res.json({
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      pendingLeaves,
      studentsByDepartment: deptCounts,
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