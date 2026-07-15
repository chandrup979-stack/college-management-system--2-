import { useEffect, useState } from "react";
import api from "../services/api";

const emptyStudentForm = {
  name: "", email: "", password: "", phone: "", department: "",
  rollNumber: "", course: "", semester: "", batch: "", parentContact: "",
};

const emptyFacultyForm = {
  name: "", email: "", password: "", phone: "", department: "",
  employeeId: "", designation: "",
};

const Users = () => {
  const [tab, setTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [facultyForm, setFacultyForm] = useState(emptyFacultyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [studentsRes, facultyRes, deptRes, courseRes] = await Promise.all([
        api.get("/users/students"),
        api.get("/users/faculty"),
        api.get("/departments"),
        api.get("/courses"),
      ]);
      setStudents(studentsRes.data);
      setFaculty(facultyRes.data);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/users/students", {
        ...studentForm,
        semester: studentForm.semester ? Number(studentForm.semester) : undefined,
      });
      setStudentForm(emptyStudentForm);
      setSuccess("Student added successfully");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/users/faculty", facultyForm);
      setFacultyForm(emptyFacultyForm);
      setSuccess("Faculty added successfully");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add faculty");
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm("Remove this student?")) return;
    await api.delete(`/users/students/${id}`);
    loadData();
  };

  const deleteFaculty = async (id) => {
    if (!confirm("Remove this faculty member?")) return;
    await api.delete(`/users/faculty/${id}`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student &amp; Faculty Management</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 max-w-xl">{success}</p>}

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("students")} className={`px-4 py-2 rounded ${tab === "students" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>
          Students
        </button>
        <button onClick={() => setTab("faculty")} className={`px-4 py-2 rounded ${tab === "faculty" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>
          Faculty
        </button>
      </div>

      {tab === "students" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Student</h2>
            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <input type="text" placeholder="Full name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="email" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="password" placeholder="Password" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Phone" value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              <select value={studentForm.department} onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <input type="text" placeholder="Roll number" value={studentForm.rollNumber} onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <select value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select course</option>
                {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="number" placeholder="Semester" value={studentForm.semester} onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Batch (e.g. 2023-2027)" value={studentForm.batch} onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Parent contact" value={studentForm.parentContact} onChange={(e) => setStudentForm({ ...studentForm, parentContact: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Student</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700 mb-2">Existing Students ({students.length})</h3>
            <ul className="divide-y divide-gray-200">
              {students.map((s) => (
                <li key={s._id} className="py-2 flex justify-between items-center">
                  <span>
                    {s.user?.name} <span className="text-gray-400">({s.rollNumber})</span><br />
                    <span className="text-xs text-gray-500">{s.user?.email}</span>
                  </span>
                  <button onClick={() => deleteStudent(s._id)} className="text-red-600 text-sm hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "faculty" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Faculty</h2>
            <form onSubmit={handleFacultySubmit} className="space-y-3">
              <input type="text" placeholder="Full name" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="email" placeholder="Email" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="password" placeholder="Password" value={facultyForm.password} onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Phone" value={facultyForm.phone} onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              <select value={facultyForm.department} onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <input type="text" placeholder="Employee ID" value={facultyForm.employeeId} onChange={(e) => setFacultyForm({ ...facultyForm, employeeId: e.target.value })} required className="w-full border border-gray-300 rounded px-3 py-2" />
              <input type="text" placeholder="Designation (e.g. Assistant Professor)" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Faculty</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700 mb-2">Existing Faculty ({faculty.length})</h3>
            <ul className="divide-y divide-gray-200">
              {faculty.map((f) => (
                <li key={f._id} className="py-2 flex justify-between items-center">
                  <span>
                    {f.user?.name} <span className="text-gray-400">({f.employeeId})</span><br />
                    <span className="text-xs text-gray-500">{f.user?.email}</span>
                  </span>
                  <button onClick={() => deleteFaculty(f._id)} className="text-red-600 text-sm hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;