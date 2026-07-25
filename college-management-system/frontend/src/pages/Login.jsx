import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

const roleTabs = [
  { key: "student", label: "Student" },
  { key: "faculty", label: "Faculty" },
  { key: "admin", label: "Admin" },
];

const roleLabels = { student: "Student", faculty: "Faculty", admin: "Admin" };

const Login = () => {
  const { role } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.role !== role) {
        setError(`This account is not a ${roleLabels[role]} account. Please use the correct tab.`);
        return;
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo + branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center mb-3 shadow-lg shadow-gold-500/30">
            <GraduationCap className="text-ink-900" size={28} />
          </div>
          <h1 className="font-display text-xl font-bold text-ink-900">
            <span className="text-ink-900">SCMS</span>{" "}
            <span className="text-gold-500">Portal</span>
          </h1>
          <p className="text-xs tracking-wider text-slate-400 mt-1">
            SMART COLLEGE MANAGEMENT
          </p>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          {roleTabs.map((t) => (
            <Link
              key={t.key}
              to={`/login/${t.key}`}
              className={`text-center text-xs font-semibold uppercase tracking-wide py-2 rounded-lg transition ${
                role === t.key
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4 border border-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Account Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800 text-white font-semibold text-sm uppercase tracking-wide py-3.5 rounded-xl transition mt-2"
          >
            Sign In
            <ArrowRight size={16} />
          </button>
        </form>

        {role !== "admin" && (
          <p className="text-sm text-slate-500 text-center mt-5">
            New here?{" "}
            <Link to={`/register/${role}`} className="text-ink-900 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        )}

        <p className="text-xs text-slate-400 text-center mt-4">
          <Link to="/" className="hover:underline">← Back to role selection</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;