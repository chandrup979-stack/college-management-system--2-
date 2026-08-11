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
import { AlertTriangle } from "lucide-react";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6", "#0891b2"];

const AdminDashboardCharts = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

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

  const shortage = stats.attendanceShortage || [];
  const visibleShortage = showAll ? shortage : shortage.slice(0, 5);

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

      {shortage.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-semibold text-gray-800">
              Attendance Shortage Alert ({shortage.length} student{shortage.length !== 1 ? "s" : ""} below 75%)
            </h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {visibleShortage.map((s) => (
              <li key={s.studentId} className="py-2 flex justify-between items-center text-sm">
                <span>
                  <span className="font-medium">{s.name}</span>{" "}
                  <span className="text-gray-400">({s.rollNumber} — {s.year})</span>
                </span>
                <span className="text-red-600 font-semibold">{s.overallPercentage}%</span>
              </li>
            ))}
          </ul>
          {shortage.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 text-sm hover:underline mt-2"
            >
              {showAll ? "Show less" : `Show all ${shortage.length}`}
            </button>
          )}
        </div>
      )}

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
      </div>
    </div>
  );
};

export default AdminDashboardCharts;