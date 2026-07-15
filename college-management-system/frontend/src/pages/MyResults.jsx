import { useEffect, useState } from "react";
import api from "../services/api";

const examLabels = {
  internal1: "Internal 1",
  internal2: "Internal 2",
  final: "Final",
};

const MyResults = () => {
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/marks/me")
      .then((res) => setMarks(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load results"));
  }, []);

  const grouped = marks.reduce((acc, m) => {
    const key = m.subject?._id || "unknown";
    if (!acc[key]) {
      acc[key] = { subject: m.subject?.name, code: m.subject?.code, exams: [] };
    }
    acc[key].exams.push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Results</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}

      <div className="space-y-4 max-w-2xl">
        {Object.values(grouped).length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">No marks published yet.</p>
          </div>
        ) : (
          Object.values(grouped).map((g) => (
            <div key={g.code} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-800 mb-3">
                {g.subject} <span className="text-gray-400 text-sm">({g.code})</span>
              </h3>
              <ul className="divide-y divide-gray-200">
                {g.exams.map((e) => (
                  <li key={e._id} className="py-2 flex justify-between items-center">
                    <span className="text-gray-600">{examLabels[e.examType] || e.examType}</span>
                    <span className="font-medium">
                      {e.marksObtained} / {e.maxMarks}{" "}
                      <span className="text-gray-400 text-sm">
                        ({Math.round((e.marksObtained / e.maxMarks) * 100)}%)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyResults;