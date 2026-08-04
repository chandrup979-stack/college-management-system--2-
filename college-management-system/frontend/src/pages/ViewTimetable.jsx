import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const dayOrders = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];

const ViewTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [dayOrder, setDayOrder] = useState("");
  const [todayDayOrder, setTodayDayOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dayorder").then((res) => setTodayDayOrder(res.data.dayOrder));
    if (user?.role !== "student") {
      api.get("/courses").then((res) => {
        setCourses(res.data);
        if (res.data.length === 1) setCourse(res.data[0]._id);
      });
    }
  }, [user]);

  const load = async () => {
    try {
      const effectiveDayOrder = dayOrder || todayDayOrder;
      if (!effectiveDayOrder) return;

      if (user?.role === "student") {
        const { data } = await api.get(`/timetable/me?dayOrder=${encodeURIComponent(effectiveDayOrder)}`);
        setTimetable(data);
      } else {
        if (!course || !year) return;
        const { data } = await api.get(
          `/timetable?course=${course}&year=${encodeURIComponent(year)}&dayOrder=${encodeURIComponent(effectiveDayOrder)}`
        );
        setTimetable(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load timetable");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, year, dayOrder, todayDayOrder]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">Timetable</h1>
      {todayDayOrder && (
        <p className="text-sm text-slate-500 mb-6">Today is <span className="font-medium text-ink-900">{todayDayOrder}</span></p>
      )}

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}

      <div className="flex flex-wrap gap-4 mb-6 max-w-xl">
        {user?.role !== "student" && (
          <>
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select year</option>
              {["1st Year", "2nd Year", "3rd Year"].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </>
        )}
        <select value={dayOrder} onChange={(e) => setDayOrder(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Today ({todayDayOrder || "not set"})</option>
          {dayOrders.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-3xl">
        {timetable.length === 0 ? (
          <p className="text-slate-500">No timetable available for this selection.</p>
        ) : (
          timetable.map((t) => (
            <div key={t._id} className="mb-4">
              <h4 className="font-semibold text-ink-900 mb-1">{t.dayOrder}</h4>
              <ul className="text-sm text-slate-600 divide-y divide-slate-100">
                {[...t.periods].sort((a, b) => a.periodNumber - b.periodNumber).map((p, i) => (
                  <li key={i} className="py-1.5 flex justify-between">
                    <span>Period {p.periodNumber} · {p.time}</span>
                    <span className="font-medium text-ink-900">
                      {p.subject?.name || p.label} {p.faculty?.user?.name ? `— ${p.faculty.user.name}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewTimetable;