import { useEffect, useState } from "react";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StudentDashboardCharts = () => {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/attendance/me")
      .then((res) => setAttendance(res.data.percentages))
      .catch((err) => setError(err.response?.data?.message || "Failed to load attendance"));
  }, []);

  if (error) return <p className="bg-red-100 text-red-700 text-sm p-2 rounded max-w-xl">{error}</p>;
  if (attendance.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="font-semibold text-gray-800 mb-4">My Attendance Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={attendance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="code" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar
            dataKey="percentage"
            radius={[4, 4, 0, 0]}
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentDashboardCharts;