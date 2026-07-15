import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name} ({user?.role})
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {user?.role === "admin" && (
        <div className="mb-6 flex gap-3 flex-wrap">
          <Link
            to="/departments"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Manage Departments &amp; Courses
          </Link>
          <Link
            to="/users"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Manage Students &amp; Faculty
          </Link>
          <Link
            to="/subjects"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Manage Subjects
          </Link>
        </div>
      )}

      {user?.role === "faculty" && (
        <div className="mb-6 flex gap-3 flex-wrap">
          <Link
            to="/mark-attendance"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Mark Attendance
          </Link>
          <Link
            to="/enter-marks"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Enter Marks
          </Link>
        </div>
      )}

      {user?.role === "student" && (
        <div className="mb-6 flex gap-3 flex-wrap">
          <Link
            to="/my-attendance"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View My Attendance
          </Link>
          <Link
            to="/my-results"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View My Results
          </Link>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">
          This is your dashboard. Role-specific widgets (assignments,
          announcements, etc.) will go here as each module is built.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;