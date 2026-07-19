import { useAuth } from "../context/AuthContext";
import AdminDashboardCharts from "./AdminDashboardCharts";
import StudentDashboardCharts from "./StudentDashboardCharts";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-slate-500 mb-6 capitalize">{user?.role} dashboard</p>

      {user?.role === "admin" && <AdminDashboardCharts />}
      {user?.role === "student" && <StudentDashboardCharts />}

      {user?.role === "faculty" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-600">
            Use the sidebar to mark attendance, enter marks, manage assignments,
            review leave requests, or check the timetable and notice board.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;