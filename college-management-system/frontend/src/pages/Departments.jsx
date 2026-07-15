import { useEffect, useState } from "react";
import api from "../services/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [deptForm, setDeptForm] = useState({ name: "", code: "" });
  const [courseForm, setCourseForm] = useState({ name: "", code: "", department: "", duration: "" });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [deptRes, courseRes] = await Promise.all([
        api.get("/departments"),
        api.get("/courses"),
      ]);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/departments", deptForm);
      setDeptForm({ name: "", code: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create department");
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/courses", {
        ...courseForm,
        duration: Number(courseForm.duration),
      });
      setCourseForm({ name: "", code: "", department: "", duration: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  const deleteDepartment = async (id) => {
    if (!confirm("Delete this department?")) return;
    await api.delete(`/departments/${id}`);
    loadData();
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/courses/${id}`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Departments &amp; Courses</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add Department</h2>
          <form onSubmit={handleDeptSubmit} className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Department name"
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Department code (e.g. CSE)"
              value={deptForm.code}
              onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add Department
            </button>
          </form>

          <h3 className="font-medium text-gray-700 mb-2">Existing Departments ({departments.length})</h3>
          <ul className="divide-y divide-gray-200">
            {departments.map((d) => (
              <li key={d._id} className="py-2 flex justify-between items-center">
                <span>{d.name} <span className="text-gray-400">({d.code})</span></span>
                <button onClick={() => deleteDepartment(d._id)} className="text-red-600 text-sm hover:underline">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Add Course</h2>
          <form onSubmit={handleCourseSubmit} className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Course name"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Course code (e.g. CSE101)"
              value={courseForm.code}
              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <select
              value={courseForm.department}
              onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Duration (years)"
              value={courseForm.duration}
              onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add Course
            </button>
          </form>

          <h3 className="font-medium text-gray-700 mb-2">Existing Courses ({courses.length})</h3>
          <ul className="divide-y divide-gray-200">
            {courses.map((c) => (
              <li key={c._id} className="py-2 flex justify-between items-center">
                <span>{c.name} <span className="text-gray-400">({c.code})</span> — {c.department?.name}</span>
                <button onClick={() => deleteCourse(c._id)} className="text-red-600 text-sm hover:underline">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Departments;