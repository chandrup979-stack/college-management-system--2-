import { useEffect, useState } from "react";
import api from "../services/api";

const years = ["1st Year", "2nd Year", "3rd Year"];

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", course: "", year: "1st Year", faculty: "" });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [subRes, courseRes, facRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/courses"),
        api.get("/users/faculty"),
      ]);
      setSubjects(subRes.data);
      setCourses(courseRes.data);
      setFaculty(facRes.data);

      if (courseRes.data.length === 1) {
        setForm((f) => ({ ...f, course: f.course || courseRes.data[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/subjects", form);
      setForm({ ...form, name: "", code: "", faculty: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create subject");
    }
  };

  const deleteSubject = async (id) => {
    if (!confirm("Delete this subject?")) return;
    await api.delete(`/subjects/${id}`);
    loadData();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Subjects</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">Add Subject</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Subject name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            <input type="text" placeholder="Subject code (e.g. CS101-DS)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Assign faculty</option>
              {faculty.map((f) => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
            </select>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">Add Subject</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-700 mb-2">Existing Subjects ({subjects.length})</h3>
          <ul className="divide-y divide-slate-100">
            {subjects.map((s) => (
              <li key={s._id} className="py-3 flex justify-between items-center">
                <span>
                  <span className="font-medium">{s.name}</span> <span className="text-slate-400 text-sm">({s.code})</span><br />
                  <span className="text-xs text-slate-500">{s.year} — Faculty: {s.faculty?.user?.name || "Unassigned"}</span>
                </span>
                <button onClick={() => deleteSubject(s._id)} className="text-red-600 text-sm hover:underline">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Subjects;