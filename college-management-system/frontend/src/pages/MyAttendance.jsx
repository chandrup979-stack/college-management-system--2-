import { useEffect, useState } from "react";
import api from "../services/api";

const MyAttendance = () => {
  const [percentages, setPercentages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/attendance/me")
      .then((res) => setPercentages(res.data.percentages))
      .catch((err) => setError(err.response?.data?.message || "Failed to load attendance"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Attendance</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        {percentages.length === 0 ? (
          <p className="text-gray-500">No attendance records yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {percentages.map((p) => (
              <li key={p.code} className="py-3 flex justify-between items-center">
                <span>
                  {p.subject} <span className="text-gray-400">({p.code})</span><br />
                  <span className="text-xs text-gray-500">{p.present} / {p.total} classes attended</span>
                </span>
                <span className={`text-lg font-bold ${p.percentage >= 75 ? "text-green-600" : "text-red-600"}`}>
                  {p.percentage}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;