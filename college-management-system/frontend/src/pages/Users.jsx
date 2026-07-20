import { useEffect, useState } from "react";
import api from "../services/api";

const years = ["1st Year", "2nd Year", "3rd Year"];

const emptyStudentForm = {
  name: "", email: "", password: "", phone: "", department: "",
  rollNumber: "", course: "", year: "1st Year", batch: "", parentContact: "",
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

      if (deptRes.data.length === 1) {
        setStudentForm((f) => ({ ...f, department: f.department || deptRes.data[0]._id }));
        setFacultyForm((f) => ({ ...f, department: f.department || deptRes.data[0]._id }));
      }
      if (courseRes.data.length === 1) {
        setStudentForm((f) => ({ ...f, course: f.course || courseRes.data[0]._id }));
      }
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

    const emailPattern = /@kprcaa\.ac\.in$/i;
    if (!emailPattern.test(studentForm.email.trim())) {
      setError("Only email addresses ending with @kprcaa.ac.in are allowed");
      return;
    }

    try {
      await api.post("/users/students", studentForm);
      setStudentForm({ ...emptyStudentForm, department: studentForm.department, course: studentForm.course });
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

    const emailPattern = /@kprcaa\.ac\.in$/i;
    if (!emailPattern.test(facultyForm.email.trim())) {
      setError("Only email addresses ending with @kprcaa.ac.in are allowed");
      return;
    }

    try {
      await api.post("/users/faculty", facultyForm);
      setFacultyForm({ ...emptyFacultyForm, department: facultyForm.department });
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
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Student &amp; Faculty Management</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("students")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "students" ? "bg-ink-900 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
          Students
        </button>
        <button onClick={() => setTab("faculty")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "faculty" ? "bg-ink-900 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
          Faculty
        </button>
      </div>

      {tab === "students" && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {years.map((y) => (
              <div key={y} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <p className="text-2xl font-display font-semibold text-ink-900">
                  {students.filter((s) => s.year === y).length}
                </p>
                <p className="text-sm text-slate-500">{y}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Add Student</h2>
              <form onSubmit={handleStudentSubmit} className="space-y-3">
                <input type="text" placeholder="Full name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input type="email" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input type="password" placeholder="Password" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="Phone" value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <select value={studentForm.department} onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select department</option>
                  {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                <input type="text" placeholder="Roll number" value={studentForm.rollNumber} onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <select value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select course</option>
                  {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <select value={studentForm.year} onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <input type="text" placeholder="Batch (e.g. 2023-2027)" value={studentForm.batch} onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="Parent contact" value={studentForm.parentContact} onChange={(e) => setStudentForm({ ...studentForm, parentContact: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">Add Student</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-medium text-slate-700 mb-2">Existing Students ({students.length})</h3>
              <ul className="divide-y divide-slate-100">
                {students.map((s) => (
                  <li key={s._id} className="py-3 flex justify-between items-center">
                    <span>
                      <span className="font-medium">{s.user?.name}</span> <span className="text-slate-400 text-sm">({s.rollNumber})</span><br />
                      <span className="text-xs text-slate-500">{s.user?.email} — {s.year}</span>
                    </span>
                    <button onClick={() => deleteStudent(s._id)} className="text-red-600 text-sm hover:underline">Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {tab === "faculty" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Add Faculty</h2>
            <form onSubmit={handleFacultySubmit} className="space-y-3">
              <input type="text" placeholder="Full name" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="email" placeholder="Email" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="password" placeholder="Password" value={facultyForm.password} onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="Phone" value={facultyForm.phone} onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <select value={facultyForm.department} onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <input type="text" placeholder="Employee ID" value={facultyForm.employeeId} onChange={(e) => setFacultyForm({ ...facultyForm, employeeId: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="Designation (e.g. Assistant Professor)" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">Add Faculty</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-medium text-slate-700 mb-2">Existing Faculty ({faculty.length})</h3>
            <ul className="divide-y divide-slate-100">
              {faculty.map((f) => (
                <li key={f._id} className="py-3 flex justify-between items-center">
                  <span>
                    <span className="font-medium">{f.user?.name}</span> <span className="text-slate-400 text-sm">({f.employeeId})</span><br />
                    <span className="text-xs text-slate-500">{f.user?.email}</span>
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