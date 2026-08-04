import { useEffect, useState } from "react";
import api from "../services/api";

const years = ["1st Year", "2nd Year", "3rd Year"];
const dayOrders = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];

const emptyPeriod = { periodNumber: 1, time: "", subject: "", faculty: "", label: "" };

const ManageTimetable = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("1st Year");
  const [dayOrder, setDayOrder] = useState("Day 1");
  const [periods, setPeriods] = useState([{ ...emptyPeriod }]);
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([api.get("/courses"), api.get("/subjects"), api.get("/users/faculty")]).then(
      ([c, s, f]) => {
        setCourses(c.data);
        setSubjects(s.data);
        setFaculty(f.data);
        if (c.data.length === 1) setCourse((cur) => cur || c.data[0]._id);
      }
    );
  }, []);

  const loadTimetable = async () => {
    if (!course || !year) return;
    const { data } = await api.get(`/timetable?course=${course}&year=${encodeURIComponent(year)}`);
    setTimetable(data);
  };

  useEffect(() => {
    loadTimetable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, year]);

  const updatePeriod = (idx, field, value) => {
    const updated = [...periods];
    updated[idx][field] = value;
    setPeriods(updated);
  };

  const addPeriod = () =>
    setPeriods([...periods, { ...emptyPeriod, periodNumber: periods.length + 1 }]);
  const removePeriod = (idx) => setPeriods(periods.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/timetable", {
        course,
        year,
        dayOrder,
        periods: periods.filter((p) => p.time && (p.subject || p.label)),
      });
      setSuccess(`Timetable saved for ${dayOrder}`);
      setPeriods([{ ...emptyPeriod }]);
      loadTimetable();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save timetable");
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm("Delete this day order's timetable?")) return;
    await api.delete(`/timetable/${id}`);
    loadTimetable();
  };

  const loadExisting = (t) => {
    setDayOrder(t.dayOrder);
    setPeriods(
      t.periods.map((p) => ({
        periodNumber: p.periodNumber || 1,
        time: p.time || "",
        subject: p.subject?._id || "",
        faculty: p.faculty?._id || "",
        label: p.label || "",
      }))
    );
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Manage Timetable</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-3xl mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select value={course} onChange={(e) => setCourse(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Select course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={dayOrder} onChange={(e) => setDayOrder(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {dayOrders.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="font-medium text-slate-700 mb-2">Periods for {dayOrder}</h3>
          {periods.map((p, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-center">
              <input
                type="number"
                placeholder="#"
                value={p.periodNumber}
                onChange={(e) => updatePeriod(idx, "periodNumber", Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
              />
              <input
                type="text"
                placeholder="Time (e.g. 9:15-10:10)"
                value={p.time}
                onChange={(e) => updatePeriod(idx, "time", e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
              />
              <select
                value={p.subject}
                onChange={(e) => updatePeriod(idx, "subject", e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
              >
                <option value="">Subject</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select
                value={p.faculty}
                onChange={(e) => updatePeriod(idx, "faculty", e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
              >
                <option value="">Faculty</option>
                {faculty.map((f) => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
              </select>
              <input
                type="text"
                placeholder="Or label (e.g. Lunch)"
                value={p.label}
                onChange={(e) => updatePeriod(idx, "label", e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
              />
              <button type="button" onClick={() => removePeriod(idx)} className="text-red-600 text-sm hover:underline">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addPeriod} className="text-ink-700 text-sm hover:underline mb-4">
            + Add another period
          </button>
          <div>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Save {dayOrder}
            </button>
          </div>
        </form>
      </div>

      {timetable.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-3xl">
          <h3 className="font-medium text-slate-700 mb-3">Existing Day Orders for this Course/Year</h3>
          {timetable.map((t) => (
            <div key={t._id} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">{t.dayOrder}</h4>
                <span className="flex gap-3">
                  <button onClick={() => loadExisting(t)} className="text-ink-700 text-sm hover:underline">Edit</button>
                  <button onClick={() => deleteEntry(t._id)} className="text-red-600 text-sm hover:underline">Delete</button>
                </span>
              </div>
              <ul className="text-sm text-slate-600 divide-y divide-slate-100">
                {t.periods.map((p, i) => (
                  <li key={i} className="py-1">
                    P{p.periodNumber} · {p.time} — {p.subject?.name || p.label} {p.faculty?.user?.name ? `(${p.faculty.user.name})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTimetable;