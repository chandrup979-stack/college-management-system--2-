import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6", "#0891b2"];

const AdminDashboardCharts = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/stats/admin")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"));
  }, []);

  if (error) return <p className="bg-red-100 text-red-700 text-sm p-2 rounded max-w-xl">{error}</p>;
  if (!stats) return <p className="text-gray-500">Loading stats...</p>;

  const summaryCards = [
    { label: "Total Students", value: stats.totalStudents, color: "bg-blue-600" },
    { label: "Total Faculty", value: stats.totalFaculty, color: "bg-green-600" },
    { label: "Departments", value: stats.totalDepartments, color: "bg-purple-600" },
    { label: "Courses", value: stats.totalCourses, color: "bg-orange-600" },
    { label: "Pending Leaves", value: stats.pendingLeaves, color: "bg-red-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((c) => (
          <div key={c.label} className={`${c.color} text-white rounded-lg p-4 shadow-md`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm opacity-90">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">Students per Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.studentsByDepartment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="font-semibold text-gray-800 mb-4">Students per Year</h3>
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={stats.studentsByYear}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="count" fill="#CA8A04" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.studentsByDepartment}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stats.studentsByDepartment.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCharts;