import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { GraduationCap } from "lucide-react";

const years = ["1st Year", "2nd Year", "3rd Year"];

const RegisterStudent = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", department: "",
    rollNumber: "", course: "", year: "1st Year", batch: "", parentContact: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/departments"), api.get("/courses")]).then(([d, c]) => {
      setDepartments(d.data);
      setCourses(c.data);
      if (d.data.length === 1) setForm((f) => ({ ...f, department: d.data[0]._id }));
      if (c.data.length === 1) setForm((f) => ({ ...f, course: c.data[0]._id }));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register/student", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="text-gold-500" size={24} />
          <span className="font-display font-semibold text-lg text-ink-900">Student Registration</span>
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4 border border-red-100">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Roll number" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Department</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <input type="text" placeholder="Batch (e.g. 2023-2027)" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Parent contact" value={form.parentContact} onChange={(e) => setForm({ ...form, parentContact: e.target.value })} className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />

          <button type="submit" className="col-span-2 bg-ink-900 text-white font-medium py-2.5 rounded-lg hover:bg-ink-800 transition mt-2">
            Create Account
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login/student" className="text-ink-900 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStudent;