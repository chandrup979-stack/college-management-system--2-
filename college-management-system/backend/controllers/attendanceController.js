const Attendance = require("../models/Attendance");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");

const markAttendance = async (req, res) => {
  try {
    const { subject, date, records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "records array is required" });
    }

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can mark attendance" });
    }

    const results = await Promise.all(
      records.map(({ student, status }) =>
        Attendance.findOneAndUpdate(
          { student, subject, date },
          { student, subject, date, status, markedBy: faculty._id },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceBySubject = async (req, res) => {
  try {
    const filter = { subject: req.params.subjectId };
    if (req.query.date) {
      filter.date = new Date(req.query.date);
    }

    const attendance = await Attendance.find(filter).populate({
      path: "student",
      populate: { path: "user", select: "name email" },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId }).populate(
      "subject",
      "name code"
    );

    const summary = {};
    records.forEach((r) => {
      const key = r.subject._id.toString();
      if (!summary[key]) {
        summary[key] = {
          subject: r.subject.name,
          code: r.subject.code,
          total: 0,
          present: 0,
        };
      }
      summary[key].total += 1;
      if (r.status === "present") summary[key].present += 1;
    });

    const percentages = Object.values(summary).map((s) => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));

    res.json({ records, percentages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const records = await Attendance.find({ student: student._id }).populate(
      "subject",
      "name code"
    );

    const summary = {};
    records.forEach((r) => {
      const key = r.subject._id.toString();
      if (!summary[key]) {
        summary[key] = {
          subject: r.subject.name,
          code: r.subject.code,
          total: 0,
          present: 0,
        };
      }
      summary[key].total += 1;
      if (r.status === "present") summary[key].present += 1;
    });

    const percentages = Object.values(summary).map((s) => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));

    res.json({ records, percentages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendanceBySubject,
  getStudentAttendance,
  getMyAttendance,
};