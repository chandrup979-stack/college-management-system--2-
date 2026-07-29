import { useEffect, useState } from "react";
import api from "../services/api";
import { Search } from "lucide-react";

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
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentYearFilter, setStudentYearFilter] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
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

  const resetStudentForm = () => {
    setStudentForm({ ...emptyStudentForm, department: studentForm.department, course: studentForm.course });
    setEditingStudentId(null);
  };

  const resetFacultyForm = () => {
    setFacultyForm({ ...emptyFacultyForm, department: facultyForm.department });
    setEditingFacultyId(null);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingStudentId) {
        await api.put(`/users/students/${editingStudentId}`, studentForm);
        setSuccess("Student updated successfully");
      } else {
        await api.post("/users/students", studentForm);
        setSuccess("Student added successfully");
      }
      resetStudentForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save student");
    }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingFacultyId) {
        await api.put(`/users/faculty/${editingFacultyId}`, facultyForm);
        setSuccess("Faculty updated successfully");
      } else {
        await api.post("/users/faculty", facultyForm);
        setSuccess("Faculty added successfully");
      }
      resetFacultyForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save faculty");
    }
  };

  const startEditStudent = (s) => {
    setEditingStudentId(s._id);
    setStudentForm({
      name: s.user?.name || "",
      email: s.user?.email || "",
      password: "",
      phone: s.user?.phone || "",
      department: s.user?.department || "",
      rollNumber: s.rollNumber || "",
      course: s.course?._id || s.course || "",
      year: s.year || "1st Year",
      batch: s.batch || "",
      parentContact: s.parentContact || "",
    });
  };

  const startEditFaculty = (f) => {
    setEditingFacultyId(f._id);
    setFacultyForm({
      name: f.user?.name || "",
      email: f.user?.email || "",
      password: "",
      phone: f.user?.phone || "",
      department: f.user?.department || "",
      employeeId: f.employeeId || "",
      designation: f.designation || "",
    });
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

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.user?.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesYear = !studentYearFilter || s.year === studentYearFilter;
    return matchesSearch && matchesYear;
  });

  const filteredFaculty = faculty.filter(
    (f) =>
      f.user?.name?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.employeeId?.toLowerCase().includes(facultySearch.toLowerCase())
  );

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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{editingStudentId ? "Edit Student" : "Add Student"}</h2>
                {editingStudentId && (
                  <button onClick={resetStudentForm} className="text-xs text-slate-500 hover:underline">Cancel edit</button>
                )}
              </div>
              <form onSubmit={handleStudentSubmit} className="space-y-3">
                <input type="text" placeholder="Full name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input type="email" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required disabled={!!editingStudentId} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400" />
                {!editingStudentId && (
                  <input type="password" placeholder="Password" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                )}
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
                <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
                  {editingStudentId ? "Update Student" : "Add Student"}
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-medium text-slate-700 mb-3">Existing Students ({filteredStudents.length})</h3>

              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or roll number"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm"
                  />
                </div>
                <select value={studentYearFilter} onChange={(e) => setStudentYearFilter(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-2 text-sm">
                  <option value="">All years</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {filteredStudents.map((s) => (
                  <li key={s._id} className="py-3 flex justify-between items-center">
                    <span>
                      <span className="font-medium">{s.user?.name}</span> <span className="text-slate-400 text-sm">({s.rollNumber})</span><br />
                      <span className="text-xs text-slate-500">{s.user?.email} — {s.year}</span>
                    </span>
                    <span className="flex gap-3 shrink-0 ml-2">
                      <button onClick={() => startEditStudent(s)} className="text-ink-700 text-sm hover:underline">Edit</button>
                      <button onClick={() => deleteStudent(s._id)} className="text-red-600 text-sm hover:underline">Remove</button>
                    </span>
                  </li>
                ))}
                {filteredStudents.length === 0 && <p className="text-slate-400 text-sm py-4">No students match your search.</p>}
              </ul>
            </div>
          </div>
        </>
      )}

      {tab === "faculty" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editingFacultyId ? "Edit Faculty" : "Add Faculty"}</h2>
              {editingFacultyId && (
                <button onClick={resetFacultyForm} className="text-xs text-slate-500 hover:underline">Cancel edit</button>
              )}
            </div>
            <form onSubmit={handleFacultySubmit} className="space-y-3">
              <input type="text" placeholder="Full name" value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="email" placeholder="Email" value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} required disabled={!!editingFacultyId} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400" />
              {!editingFacultyId && (
                <input type="password" placeholder="Password" value={facultyForm.password} onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              )}
              <input type="text" placeholder="Phone" value={facultyForm.phone} onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <select value={facultyForm.department} onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <input type="text" placeholder="Employee ID" value={facultyForm.employeeId} onChange={(e) => setFacultyForm({ ...facultyForm, employeeId: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input type="text" placeholder="Designation (e.g. Assistant Professor)" value={facultyForm.designation} onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
                {editingFacultyId ? "Update Faculty" : "Add Faculty"}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-medium text-slate-700 mb-3">Existing Faculty ({filteredFaculty.length})</h3>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or employee ID"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>

            <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredFaculty.map((f) => (
                <li key={f._id} className="py-3 flex justify-between items-center">
                  <span>
                    <span className="font-medium">{f.user?.name}</span> <span className="text-slate-400 text-sm">({f.employeeId})</span><br />
                    <span className="text-xs text-slate-500">{f.user?.email}</span>
                  </span>
                  <span className="flex gap-3 shrink-0 ml-2">
                    <button onClick={() => startEditFaculty(f)} className="text-ink-700 text-sm hover:underline">Edit</button>
                    <button onClick={() => deleteFaculty(f._id)} className="text-red-600 text-sm hover:underline">Remove</button>
                  </span>
                </li>
              ))}
              {filteredFaculty.length === 0 && <p className="text-slate-400 text-sm py-4">No faculty match your search.</p>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;