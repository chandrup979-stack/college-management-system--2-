import { useEffect, useState } from "react";
import api from "../services/api";

const dayOrders = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Holiday"];

const DayOrderCalendar = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dayOrder, setDayOrder] = useState("Day 1");
  const [upcoming, setUpcoming] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUpcoming = async () => {
    const { data } = await api.get("/dayorder/upcoming?days=14");
    setUpcoming(data);
  };

  useEffect(() => {
    loadUpcoming();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/dayorder", { date, dayOrder });
      setSuccess(`${date} set to ${dayOrder}`);
      loadUpcoming();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Day Order Calendar</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xl">
        Assign which Day Order applies to each real calendar date. This lets the timetable
        rotate correctly around holidays and Saturdays, instead of a fixed Monday–Friday pattern.
      </p>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">Assign a Date</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={dayOrder}
              onChange={(e) => setDayOrder(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              {dayOrders.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Save
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-700 mb-3">Next 14 Days</h3>
          <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {upcoming.map((u) => (
              <li key={u.date} className="py-2 flex justify-between items-center text-sm">
                <span>{new Date(u.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                <span className={u.dayOrder ? "font-medium text-ink-900" : "text-slate-400"}>
                  {u.dayOrder || "Not set"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DayOrderCalendar;