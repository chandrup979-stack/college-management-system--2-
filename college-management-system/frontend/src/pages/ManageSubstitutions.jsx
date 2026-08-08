import { useEffect, useState } from "react";
import api from "../services/api";

const dayOrders = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];

const ManageSubstitutions = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [freeFaculty, setFreeFaculty] = useState([]);
  const [substitutions, setSubstitutions] = useState([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    dayOrder: "Day 1",
    periodNumber: 1,
    course: "",
    year: "1st Year",
    subject: "",
    originalFaculty: "",
    substituteFaculty: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadStaticData = async () => {
    const [c, s, f] = await Promise.all([
      api.get("/courses"),
      api.get("/subjects"),
      api.get("/users/faculty"),
    ]);
    setCourses(c.data);
    setSubjects(s.data);
    setFaculty(f.data);
  };

  const loadSubstitutions = async () => {
    const { data } = await api.get("/substitutions");
    setSubstitutions(data);
  };

  useEffect(() => {
    loadStaticData();
    loadSubstitutions();
  }, []);

  const loadFreeFaculty = async () => {
    if (!form.dayOrder || !form.periodNumber) return;
    const { data } = await api.get(
      `/substitutions/free-faculty?dayOrder=${encodeURIComponent(form.dayOrder)}&periodNumber=${form.periodNumber}`
    );
    setFreeFaculty(data);
  };

  useEffect(() => {
    loadFreeFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.dayOrder, form.periodNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/substitutions", form);
      setSuccess("Substitution assigned successfully");
      loadSubstitutions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign substitution");
    }
  };

  const deleteSubstitution = async (id) => {
    if (!confirm("Remove this substitution?")) return;
    await api.delete(`/substitutions/${id}`);
    loadSubstitutions();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">Substitution Management</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xl">
        Assign a free faculty member to cover a class when the original faculty is absent.
      </p>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">Assign Substitution</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.dayOrder} onChange={(e) => setForm({ ...form, dayOrder: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                {dayOrders.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input
                type="number"
                placeholder="Period #"
                value={form.periodNumber}
                onChange={(e) => setForm({ ...form, periodNumber: Number(e.target.value) })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {["1st Year", "2nd Year", "3rd Year"].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Subject (optional)</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <select value={form.originalFaculty} onChange={(e) => setForm({ ...form, originalFaculty: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Absent faculty</option>
              {faculty.map((f) => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
            </select>
            <select value={form.substituteFaculty} onChange={(e) => setForm({ ...form, substituteFaculty: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Substitute faculty (free during this period)</option>
              {freeFaculty.map((f) => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Assign Substitution
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-700 mb-3">Recent Substitutions ({substitutions.length})</h3>
          <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {substitutions.map((s) => (
              <li key={s._id} className="py-3">
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <p className="font-medium">{s.date} — {s.dayOrder}, Period {s.periodNumber}</p>
                    <p className="text-slate-500 text-xs">
                      {s.course?.name} · {s.year} {s.subject?.name ? `· ${s.subject.name}` : ""}
                    </p>
                    <p className="text-xs mt-1">
                      <span className="text-red-500">{s.originalFaculty?.user?.name}</span> →{" "}
                      <span className="text-green-600 font-medium">{s.substituteFaculty?.user?.name}</span>
                    </p>
                    {s.reason && <p className="text-xs text-slate-400 mt-1">Reason: {s.reason}</p>}
                  </div>
                  <button onClick={() => deleteSubstitution(s._id)} className="text-red-600 text-sm hover:underline shrink-0 ml-2">
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {substitutions.length === 0 && <p className="text-slate-400 text-sm py-4">No substitutions yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageSubstitutions;