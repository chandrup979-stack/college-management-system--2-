const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
  try {
    const { name, code, course, year, faculty } = req.body;

    const exists = await Subject.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Subject code already exists" });
    }

    const subject = await Subject.create({ name, code, course, year, faculty });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.faculty) filter.faculty = req.query.faculty;

    const subjects = await Subject.find(filter)
      .populate("course", "name code")
      .populate({
        path: "faculty",
        populate: { path: "user", select: "name email" },
      });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("course", "name code")
      .populate({
        path: "faculty",
        populate: { path: "user", select: "name email" },
      });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};