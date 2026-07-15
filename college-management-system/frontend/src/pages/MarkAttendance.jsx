import { useEffect, useState } from "react";
import api from "../services/api";

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/subjects").then((res) => setSubjects(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      setStudents([]);
      return;
    }
    const subject = subjects.find((s) => s._id === selectedSubject);
    if (!subject?.course?._id && !subject?.course) return;

    const courseId = subject.course?._id || subject.course;
    api
      .get("/users/students")
      .then((res) => {
        const filtered = res.data.filter((st) => st.course?._id === courseId || st.course === courseId);
        setStudents(filtered);
        const initial = {};
        filtered.forEach((st) => (initial[st._id] = "present"));
        setStatusMap(initial);
      })
      .catch(() => {});
  }, [selectedSubject, subjects]);

  const toggleStatus = (studentId) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const records = students.map((st) => ({
        student: st._id,
        status: statusMap[st._id] || "present",
      }));
      await api.post("/attendance/mark", { subject: selectedSubject, date, records });
      setSuccess("Attendance saved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 max-w-xl">{success}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <div className="flex gap-4 mb-4">
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2">
            <option value="">Select subject</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded px-3 py-2" />
        </div>

        {students.length > 0 ? (
          <form onSubmit={handleSubmit}>
            <ul className="divide-y divide-gray-200 mb-4">
              {students.map((st) => (
                <li key={st._id} className="py-2 flex justify-between items-center">
                  <span>{st.user?.name} <span className="text-gray-400">({st.rollNumber})</span></span>
                  <button
                    type="button"
                    onClick={() => toggleStatus(st._id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${statusMap[st._id] === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {statusMap[st._id] === "present" ? "Present" : "Absent"}
                  </button>
                </li>
              ))}
            </ul>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save Attendance</button>
          </form>
        ) : (
          selectedSubject && <p className="text-gray-500">No students found for this subject's course.</p>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;