import { Link } from "react-router-dom";
import { GraduationCap, Users, ShieldCheck } from "lucide-react";

const cards = [
  { role: "student", label: "Student", icon: GraduationCap, signup: true },
  { role: "faculty", label: "Faculty", icon: Users, signup: true },
  { role: "admin", label: "Admin", icon: ShieldCheck, signup: false },
];

const RoleSelect = () => {
  return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-10">
        <GraduationCap className="text-gold-400" size={30} />
        <span className="font-display font-semibold text-2xl text-white">SCMS</span>
      </div>

      <p className="text-slate-400 mb-8">Choose how you'd like to continue</p>

      <div className="grid sm:grid-cols-3 gap-5 w-full max-w-3xl">
        {cards.map(({ role, label, icon: Icon, signup }) => (
          <div key={role} className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-3">
              <Icon className="text-gold-500" size={22} />
            </div>
            <h3 className="font-display font-semibold text-ink-900 mb-4">{label}</h3>
            <Link
              to={`/login/${role}`}
              className="w-full bg-ink-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-ink-800 transition mb-2"
            >
              Login
            </Link>
            {signup && (
              <Link to={`/register/${role}`} className="text-sm text-slate-500 hover:text-ink-900 transition">
                Create an account
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelect;