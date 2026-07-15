import { useEffect, useState } from "react";
import api from "../services/api";

const examTypes = [
  { value: "internal1", label: "Internal 1" },
  { value: "internal2", label: "Internal 2" },
  { value: "final", label: "Final" },
];

const EnterMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("internal1");
  const [maxMarks, setMaxMarks] = useState(50);
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
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
    const courseId = subject?.course?._id || subject?.course;
    if (!courseId) return;

    api
      .get("/users/students")
      .then((res) => {
        const filtered = res.data.filter((st) => st.course?._id === courseId || st.course === courseId);
        setStudents(filtered);
        const initial = {};
        filtered.forEach((st) => (initial[st._id] = ""));
        setMarksMap(initial);
      })
      .catch(() => {});
  }, [selectedSubject, subjects]);

  const handleMarkChange = (studentId, value) => {
    setMarksMap((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const records = students
        .filter((st) => marksMap[st._id] !== "")
        .map((st) => ({ student: st._id, marksObtained: Number(marksMap[st._id]) }));

      if (records.length === 0) {
        setError("Enter at least one student's marks");
        return;
      }

      await api.post("/marks/bulk", {
        subject: selectedSubject,
        examType,
        maxMarks: Number(maxMarks),
        records,
      });
      setSuccess("Marks saved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save marks");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Enter Marks</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 max-w-xl">{success}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
            ))}
          </select>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {examTypes.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Max marks"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {students.length > 0 ? (
          <form onSubmit={handleSubmit}>
            <ul className="divide-y divide-gray-200 mb-4">
              {students.map((st) => (
                <li key={st._id} className="py-2 flex justify-between items-center">
                  <span>{st.user?.name} <span className="text-gray-400">({st.rollNumber})</span></span>
                  <input
                    type="number"
                    min="0"
                    max={maxMarks}
                    value={marksMap[st._id] ?? ""}
                    onChange={(e) => handleMarkChange(st._id, e.target.value)}
                    placeholder={`/ ${maxMarks}`}
                    className="w-24 border border-gray-300 rounded px-2 py-1 text-right"
                  />
                </li>
              ))}
            </ul>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Marks
            </button>
          </form>
        ) : (
          selectedSubject && <p className="text-gray-500">No students found for this subject's course.</p>
        )}
      </div>
    </div>
  );
};

export default EnterMarks;