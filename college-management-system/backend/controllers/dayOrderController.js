const DayOrderCalendar = require("../models/DayOrderCalendar");

// @route  POST /api/dayorder   (admin sets the day order for a specific date)
const setDayOrder = async (req, res) => {
  try {
    const { date, dayOrder } = req.body; // date: "YYYY-MM-DD"
    const entry = await DayOrderCalendar.findOneAndUpdate(
      { date },
      { date, dayOrder },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/dayorder?date=YYYY-MM-DD  (defaults to today)
const getDayOrder = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const entry = await DayOrderCalendar.findOne({ date });
    res.json(entry || { date, dayOrder: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/dayorder/upcoming?days=14
const getUpcoming = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    const dates = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }
    const entries = await DayOrderCalendar.find({ date: { $in: dates } });
    const map = {};
    entries.forEach((e) => (map[e.date] = e.dayOrder));
    res.json(dates.map((date) => ({ date, dayOrder: map[date] || null })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setDayOrder, getDayOrder, getUpcoming };