import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { GraduationCap } from "lucide-react";

const roleLabels = { student: "Student", faculty: "Faculty", admin: "Admin" };

const Login = () => {
  const { role } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.role !== role) {
        setError(`This account is not a ${roleLabels[role]} account. Please use the correct login page.`);
        return;
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold-500/10" />
        <div className="flex items-center gap-2 relative z-10">
          <GraduationCap className="text-gold-400" size={28} />
          <span className="font-display font-semibold text-lg">SCMS</span>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
            {roleLabels[role]} Login
          </h1>
          <p className="text-slate-400 max-w-sm">
            Sign in to access your {roleLabels[role]?.toLowerCase()} portal.
          </p>
        </div>
        <p className="text-xs text-slate-500 relative z-10">Smart College Management System</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold text-ink-900 mb-1">
            {roleLabels[role]} Sign In
          </h2>
          <p className="text-slate-500 text-sm mb-6">Enter your credentials to continue</p>

          {error && (
            <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4 border border-red-100">
              {error}
            </p>
          )}

          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />

          <button type="submit" className="w-full bg-ink-900 hover:bg-ink-800 text-white font-medium py-2.5 rounded-lg transition mb-4">
            Sign In
          </button>

          {role !== "admin" && (
            <p className="text-sm text-slate-500 text-center">
              New here?{" "}
              <Link to={`/register/${role}`} className="text-ink-900 font-medium hover:underline">
                Create an account
              </Link>
            </p>
          )}
          <p className="text-xs text-slate-400 text-center mt-3">
            <Link to="/" className="hover:underline">← Back to role selection</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;