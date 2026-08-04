const Timetable = require("../models/Timetable");
const Student = require("../models/Student");

const upsertTimetable = async (req, res) => {
  try {
    const { course, year, dayOrder, periods } = req.body;
    const timetable = await Timetable.findOneAndUpdate(
      { course, year, dayOrder },
      { course, year, dayOrder, periods },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTimetable = async (req, res) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.year) filter.year = req.query.year;
    if (req.query.dayOrder) filter.dayOrder = req.query.dayOrder;

    const timetable = await Timetable.find(filter)
      .populate("periods.subject", "name code")
      .populate({ path: "periods.faculty", populate: { path: "user", select: "name" } });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyTimetable = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const filter = { course: student.course, year: student.year };
    if (req.query.dayOrder) filter.dayOrder = req.query.dayOrder;

    const timetable = await Timetable.find(filter)
      .populate("periods.subject", "name code")
      .populate({ path: "periods.faculty", populate: { path: "user", select: "name" } });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    res.json({ message: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upsertTimetable, getTimetable, getMyTimetable, deleteTimetable };