import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterFaculty from "./pages/RegisterFaculty";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Users from "./pages/Users";
import Subjects from "./pages/Subjects";
import MarkAttendance from "./pages/MarkAttendance";
import MyAttendance from "./pages/MyAttendance";
import EnterMarks from "./pages/EnterMarks";
import MyResults from "./pages/MyResults";
import ManageAssignments from "./pages/ManageAssignments";
import MyAssignments from "./pages/MyAssignments";
import ApplyLeave from "./pages/ApplyLeave";
import ReviewLeave from "./pages/ReviewLeave";
import ManageTimetable from "./pages/ManageTimetable";
import ViewTimetable from "./pages/ViewTimetable";
import NoticeBoard from "./pages/NoticeBoard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login/student" replace />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/faculty" element={<RegisterFaculty />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute allowedRoles={["admin"]}><Departments /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute allowedRoles={["admin"]}><Subjects /></ProtectedRoute>} />
          <Route path="/mark-attendance" element={<ProtectedRoute allowedRoles={["faculty"]}><MarkAttendance /></ProtectedRoute>} />
          <Route path="/my-attendance" element={<ProtectedRoute allowedRoles={["student"]}><MyAttendance /></ProtectedRoute>} />
          <Route path="/enter-marks" element={<ProtectedRoute allowedRoles={["faculty"]}><EnterMarks /></ProtectedRoute>} />
          <Route path="/my-results" element={<ProtectedRoute allowedRoles={["student"]}><MyResults /></ProtectedRoute>} />
          <Route path="/manage-assignments" element={<ProtectedRoute allowedRoles={["faculty"]}><ManageAssignments /></ProtectedRoute>} />
          <Route path="/my-assignments" element={<ProtectedRoute allowedRoles={["student"]}><MyAssignments /></ProtectedRoute>} />
          <Route path="/apply-leave" element={<ProtectedRoute allowedRoles={["student"]}><ApplyLeave /></ProtectedRoute>} />
          <Route path="/review-leave" element={<ProtectedRoute allowedRoles={["faculty"]}><ReviewLeave /></ProtectedRoute>} />
          <Route path="/manage-timetable" element={<ProtectedRoute allowedRoles={["admin"]}><ManageTimetable /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute allowedRoles={["faculty", "student"]}><ViewTimetable /></ProtectedRoute>} />
          <Route path="/notice-board" element={<ProtectedRoute><NoticeBoard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;