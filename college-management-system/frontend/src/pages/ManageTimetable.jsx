import { useEffect, useState } from "react";
import api from "../services/api";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const years = ["1st Year", "2nd Year", "3rd Year"];

const ManageTimetable = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("1st Year");
  const [day, setDay] = useState("Monday");
  const [slots, setSlots] = useState([{ time: "", subject: "", faculty: "" }]);
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

  const updateSlot = (idx, field, value) => {
    const updated = [...slots];
    updated[idx][field] = value;
    setSlots(updated);
  };

  const addSlot = () => setSlots([...slots, { time: "", subject: "", faculty: "" }]);
  const removeSlot = (idx) => setSlots(slots.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/timetable", {
        course,
        year,
        day,
        slots: slots.filter((s) => s.time && s.subject),
      });
      setSuccess(`Timetable saved for ${day}`);
      setSlots([{ time: "", subject: "", faculty: "" }]);
      loadTimetable();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save timetable");
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm("Delete this day's timetable?")) return;
    await api.delete(`/timetable/${id}`);
    loadTimetable();
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
          <select value={day} onChange={(e) => setDay(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {days.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="font-medium text-slate-700 mb-2">Slots for {day}</h3>
          {slots.map((slot, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
              <input type="text" placeholder="Time (e.g. 9:00-10:00)" value={slot.time} onChange={(e) => updateSlot(idx, "time", e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1 text-sm" />
              <select value={slot.subject} onChange={(e) => updateSlot(idx, "subject", e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1 text-sm">
                <option value="">Subject</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select value={slot.faculty} onChange={(e) => updateSlot(idx, "faculty", e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1 text-sm">
                <option value="">Faculty</option>
                {faculty.map((f) => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
              </select>
              <button type="button" onClick={() => removeSlot(idx)} className="text-red-600 text-sm hover:underline">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addSlot} className="text-ink-700 text-sm hover:underline mb-4">+ Add another slot</button>
          <div>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Save {day}'s Timetable
            </button>
          </div>
        </form>
      </div>

      {timetable.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-3xl">
          <h3 className="font-medium text-slate-700 mb-3">Current Timetable</h3>
          {timetable.map((t) => (
            <div key={t._id} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">{t.day}</h4>
                <button onClick={() => deleteEntry(t._id)} className="text-red-600 text-sm hover:underline">Delete day</button>
              </div>
              <ul className="text-sm text-slate-600 divide-y divide-slate-100">
                {t.slots.map((s, i) => (
                  <li key={i} className="py-1">
                    {s.time} — {s.subject?.name} ({s.faculty?.user?.name || "TBD"})
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