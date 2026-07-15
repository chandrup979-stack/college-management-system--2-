const Marks = require("../models/Marks");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");

const enterMarks = async (req, res) => {
  try {
    const { student, subject, examType, marksObtained, maxMarks } = req.body;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can enter marks" });
    }

    const record = await Marks.findOneAndUpdate(
      { student, subject, examType },
      { student, subject, examType, marksObtained, maxMarks, enteredBy: faculty._id },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enterMarksBulk = async (req, res) => {
  try {
    const { subject, examType, maxMarks, records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "records array is required" });
    }

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can enter marks" });
    }

    const results = await Promise.all(
      records.map(({ student, marksObtained }) =>
        Marks.findOneAndUpdate(
          { student, subject, examType },
          { student, subject, examType, marksObtained, maxMarks, enteredBy: faculty._id },
          { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
        )
      )
    );

    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMarksBySubject = async (req, res) => {
  try {
    const filter = { subject: req.params.subjectId };
    if (req.query.examType) filter.examType = req.query.examType;

    const marks = await Marks.find(filter).populate({
      path: "student",
      populate: { path: "user", select: "name email" },
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.params.studentId }).populate(
      "subject",
      "name code"
    );
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const marks = await Marks.find({ student: student._id }).populate("subject", "name code");
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enterMarks,
  enterMarksBulk,
  getMarksBySubject,
  getStudentMarks,
  getMyMarks,
};