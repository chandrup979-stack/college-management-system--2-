const Timetable = require("../models/Timetable");
const Student = require("../models/Student");

const upsertTimetable = async (req, res) => {
  try {
    const { course, year, day, slots } = req.body;

    const timetable = await Timetable.findOneAndUpdate(
      { course, year, day },
      { course, year, day, slots },
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

    const timetable = await Timetable.find(filter)
      .populate({ path: "slots.subject", select: "name code" })
      .populate({ path: "slots.faculty", populate: { path: "user", select: "name" } });

    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    timetable.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

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

    const timetable = await Timetable.find({
      course: student.course,
      year: student.year,
    })
      .populate("slots.subject", "name code")
      .populate({ path: "slots.faculty", populate: { path: "user", select: "name" } });

    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    timetable.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

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
    res.json({ message: "Timetable entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upsertTimetable,
  getTimetable,
  getMyTimetable,
  deleteTimetable,
};