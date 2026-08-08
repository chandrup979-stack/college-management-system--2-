import { useEffect, useState } from "react";
import api from "../services/api";

const MySubstitutions = () => {
  const [substitutions, setSubstitutions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/substitutions/me")
      .then((res) => setSubstitutions(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load substitutions"));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">My Substitutions</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xl">
        Classes you've been assigned to cover for another faculty member.
      </p>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
        {substitutions.length === 0 ? (
          <p className="text-slate-500">No substitutions assigned to you.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {substitutions.map((s) => (
              <li key={s._id} className="py-3">
                <p className="font-medium">{s.date} — {s.dayOrder}, Period {s.periodNumber}</p>
                <p className="text-sm text-slate-600">
                  {s.course?.name} · {s.year} {s.subject?.name ? `· ${s.subject.name}` : ""}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Covering for {s.originalFaculty?.user?.name}
                  {s.reason ? ` — ${s.reason}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MySubstitutions;