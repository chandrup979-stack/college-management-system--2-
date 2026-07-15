import { useEffect, useState } from "react";
import api from "../services/api";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", course: "", semester: "", faculty: "" });
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
      await api.post("/subjects", {
        ...form,
        semester: form.semester ? Number(form.semester) : undefined,
      });
      setForm({ name: "", code: "", course: "", semester: "", faculty: "" });
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Subjects</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add Subject</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Subject name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Subject code (e.g. CSE101-DS)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
            <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="Semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Assign faculty</option>
              {faculty.map((f) => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Subject</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-700 mb-2">Existing Subjects ({subjects.length})</h3>
          <ul className="divide-y divide-gray-200">
            {subjects.map((s) => (
              <li key={s._id} className="py-2 flex justify-between items-center">
                <span>
                  {s.name} <span className="text-gray-400">({s.code})</span><br />
                  <span className="text-xs text-gray-500">{s.course?.name} — Faculty: {s.faculty?.user?.name || "Unassigned"}</span>
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