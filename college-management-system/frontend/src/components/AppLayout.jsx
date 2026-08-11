import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  FileText,
  CalendarDays,
  CalendarClock,
  Calendar,
  Repeat,
  DoorOpen,
  Megaphone,
  UserCircle,
  UploadCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navConfig = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "faculty", "student"] },
  { to: "/departments", label: "Departments & Courses", icon: Building2, roles: ["admin"] },
  { to: "/users", label: "Students & Faculty", icon: Users, roles: ["admin"] },
  { to: "/bulk-import", label: "Bulk Import Students", icon: UploadCircle, roles: ["admin"] },
  { to: "/subjects", label: "Subjects", icon: BookOpen, roles: ["admin"] },
  { to: "/manage-timetable", label: "Timetable", icon: CalendarClock, roles: ["admin"] },
  { to: "/day-order-calendar", label: "Day Order Calendar", icon: Calendar, roles: ["admin"] },
  { to: "/manage-substitutions", label: "Substitutions", icon: Repeat, roles: ["admin"] },
  { to: "/review-outpass", label: "Out-Pass Requests", icon: DoorOpen, roles: ["admin"] },

  { to: "/mark-attendance", label: "Mark Attendance", icon: ClipboardCheck, roles: ["faculty"] },
  { to: "/enter-marks", label: "Enter Marks", icon: GraduationCap, roles: ["faculty"] },
  { to: "/manage-assignments", label: "Assignments", icon: FileText, roles: ["faculty"] },
  { to: "/review-leave", label: "Leave Requests", icon: CalendarDays, roles: ["faculty"] },
  { to: "/timetable", label: "Timetable", icon: CalendarClock, roles: ["faculty"] },
  { to: "/my-substitutions", label: "My Substitutions", icon: Repeat, roles: ["faculty"] },
  { to: "/apply-outpass", label: "Out-Pass", icon: DoorOpen, roles: ["faculty"] },

  { to: "/my-attendance", label: "My Attendance", icon: ClipboardCheck, roles: ["student"] },
  { to: "/my-results", label: "My Results", icon: GraduationCap, roles: ["student"] },
  { to: "/my-assignments", label: "Assignments", icon: FileText, roles: ["student"] },
  { to: "/apply-leave", label: "Apply for Leave", icon: CalendarDays, roles: ["student"] },
  { to: "/timetable", label: "Timetable", icon: CalendarClock, roles: ["student"] },
  { to: "/apply-outpass", label: "Out-Pass", icon: DoorOpen, roles: ["student"] },

  { to: "/notice-board", label: "Notice Board", icon: Megaphone, roles: ["admin", "faculty", "student"] },
  { to: "/profile", label: "My Profile", icon: UserCircle, roles: ["admin", "faculty", "student"] },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = navConfig.filter((item) => item.roles.includes(user?.role));
  const seen = new Set();
  const uniqueLinks = links.filter((l) => {
    if (seen.has(l.to)) return false;
    seen.add(l.to);
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const currentLabel = uniqueLinks.find((l) => l.to === location.pathname)?.label || "SCMS";

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
        <GraduationCap className="text-gold-400" size={26} />
        <div>
          <p className="font-display font-semibold text-white leading-tight">SCMS</p>
          <p className="text-xs text-slate-400 leading-tight">College Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {uniqueLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to + label}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition border-l-2 ${
                isActive
                  ? "bg-white/5 text-gold-300 border-gold-400"
                  : "text-slate-300 border-transparent hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <NavLink
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 mb-3 hover:bg-white/5 rounded-lg p-1.5 -m-1.5 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gold-500 text-ink-900 font-semibold flex items-center justify-center text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-center text-sm bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg py-2 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden lg:flex w-64 bg-ink-900 text-slate-200 flex-col shrink-0">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-ink-900 text-slate-200 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-slate-300">
              <X size={22} />
            </button>
            {SidebarContent}
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center gap-3 bg-ink-900 text-white px-4 py-3 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="font-display font-medium text-sm truncate">{currentLabel}</span>
        </div>

        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;