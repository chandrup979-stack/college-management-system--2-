const Assignment = require("../models/Assignment");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");

const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, fileUrl, dueDate } = req.body;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can create assignments" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      faculty: faculty._id,
      fileUrl,
      dueDate,
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;

    const assignments = await Assignment.find(filter)
      .populate("subject", "name code")
      .populate({ path: "faculty", populate: { path: "user", select: "name email" } })
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("subject", "name code")
      .populate({ path: "faculty", populate: { path: "user", select: "name email" } })
      .populate({ path: "submissions.student", populate: { path: "user", select: "name email" } });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, description, fileUrl, dueDate } = req.body;
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, description, fileUrl, dueDate },
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can submit assignments" });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.submissions = assignment.submissions.filter(
      (s) => s.student.toString() !== student._id.toString()
    );
    assignment.submissions.push({
      student: student._id,
      fileUrl,
      submittedAt: new Date(),
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const Subject = require("../models/Subject");
    const subjects = await Subject.find({ course: student.course }).select("_id");
    const subjectIds = subjects.map((s) => s._id);

    const assignments = await Assignment.find({ subject: { $in: subjectIds } })
      .populate("subject", "name code")
      .sort({ dueDate: 1 });

    const withStatus = assignments.map((a) => {
      const mySubmission = a.submissions.find(
        (s) => s.student.toString() === student._id.toString()
      );
      return {
        _id: a._id,
        title: a.title,
        description: a.description,
        subject: a.subject,
        fileUrl: a.fileUrl,
        dueDate: a.dueDate,
        submitted: !!mySubmission,
        mySubmission: mySubmission || null,
      };
    });

    res.json(withStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getMyAssignments,
};