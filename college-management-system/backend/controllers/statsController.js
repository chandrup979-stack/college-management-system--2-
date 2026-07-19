const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const Course = require("../models/Course");
const LeaveRequest = require("../models/LeaveRequest");

// Admin stats: totals and students per department
const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalDepartments, totalCourses, pendingLeaves] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Department.countDocuments(),
      Course.countDocuments(),
      LeaveRequest.countDocuments({ status: "pending" }),
    ]);

    // students per department (via course -> department)
    const studentsByDepartment = await Student.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$course.department", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "dept",
        },
      },
      { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ["$dept.name", "Unassigned"] }, count: 1 } },
    ]);

    res.json({
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      pendingLeaves,
      studentsByDepartment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
};

// Faculty stats: counts for the logged-in faculty
const getFacultyStats = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id }).populate("coursesAssigned");
    if (!faculty) return res.status(404).json({ message: "Faculty profile not found" });

    const coursesAssigned = faculty.coursesAssigned || [];
    const studentsCount = await Student.countDocuments({ course: { $in: coursesAssigned.map((c) => c._id) } });

    res.json({ coursesAssigned: coursesAssigned.length, studentsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load faculty stats" });
  }
};

module.exports = { getAdminStats, getFacultyStats };
