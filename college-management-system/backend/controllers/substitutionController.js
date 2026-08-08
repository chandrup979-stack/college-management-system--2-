const Substitution = require("../models/Substitution");
const Timetable = require("../models/Timetable");
const Faculty = require("../models/Faculty");

// @route  GET /api/substitutions/free-faculty?date=...&dayOrder=...&periodNumber=...
// @desc   Admin looks up which faculty are free during a specific period
const getFreeFaculty = async (req, res) => {
  try {
    const { dayOrder, periodNumber } = req.query;
    if (!dayOrder || !periodNumber) {
      return res.status(400).json({ message: "dayOrder and periodNumber are required" });
    }

    // Find every timetable entry for this dayOrder, across all courses/years
    const allTimetables = await Timetable.find({ dayOrder });

    // Collect faculty IDs who are busy at this exact period
    const busyFacultyIds = new Set();
    allTimetables.forEach((t) => {
      t.periods.forEach((p) => {
        if (p.periodNumber === Number(periodNumber) && p.faculty) {
          busyFacultyIds.add(p.faculty.toString());
        }
      });
    });

    const allFaculty = await Faculty.find().populate("user", "name email");
    const freeFaculty = allFaculty.filter((f) => !busyFacultyIds.has(f._id.toString()));

    res.json(freeFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/substitutions
// @desc   Admin assigns a substitute for a period
const createSubstitution = async (req, res) => {
  try {
    const {
      date, dayOrder, periodNumber, course, year,
      subject, originalFaculty, substituteFaculty, reason,
    } = req.body;

    const substitution = await Substitution.create({
      date, dayOrder, periodNumber, course, year,
      subject, originalFaculty, substituteFaculty, reason,
      assignedBy: req.user._id,
    });

    res.status(201).json(substitution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/substitutions?date=...
// @desc   Admin views all substitutions (optionally filtered by date)
const getSubstitutions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;

    const substitutions = await Substitution.find(filter)
      .populate("course", "name")
      .populate("subject", "name code")
      .populate({ path: "originalFaculty", populate: { path: "user", select: "name" } })
      .populate({ path: "substituteFaculty", populate: { path: "user", select: "name" } })
      .sort({ date: -1 });

    res.json(substitutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/substitutions/me
// @desc   Faculty views substitutions assigned TO them (classes they need to cover)
const getMySubstitutions = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(403).json({ message: "Only faculty can view this" });
    }

    const substitutions = await Substitution.find({ substituteFaculty: faculty._id })
      .populate("course", "name")
      .populate("subject", "name code")
      .populate({ path: "originalFaculty", populate: { path: "user", select: "name" } })
      .sort({ date: -1 });

    res.json(substitutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/substitutions/:id
const deleteSubstitution = async (req, res) => {
  try {
    const substitution = await Substitution.findByIdAndDelete(req.params.id);
    if (!substitution) {
      return res.status(404).json({ message: "Substitution not found" });
    }
    res.json({ message: "Substitution removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFreeFaculty,
  createSubstitution,
  getSubstitutions,
  getMySubstitutions,
  deleteSubstitution,
};