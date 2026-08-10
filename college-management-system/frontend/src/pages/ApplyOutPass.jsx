import { useEffect, useState } from "react";
import api from "../services/api";

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const ApplyOutPass = () => {
  const [outPasses, setOutPasses] = useState([]);
  const [form, setForm] = useState({
    reason: "",
    date: new Date().toISOString().slice(0, 10),
    outTime: "",
    expectedInTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const { data } = await api.get("/outpass/me");
      setOutPasses(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load out-pass requests");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/outpass", form);
      setForm({ reason: "", date: new Date().toISOString().slice(0, 10), outTime: "", expectedInTime: "" });
      setSuccess("Out-pass request submitted");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Out-Pass Requests</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              placeholder="Reason for leaving campus"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <div>
              <label className="text-xs text-slate-500">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500">Out time</label>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  value={form.outTime}
                  onChange={(e) => setForm({ ...form, outTime: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Expected return</label>
                <input
                  type="text"
                  placeholder="e.g. 2:00 PM"
                  value={form.expectedInTime}
                  onChange={(e) => setForm({ ...form, expectedInTime: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <button type="submit" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium">
              Submit Request
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-700 mb-3">My Requests ({outPasses.length})</h3>
          <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {outPasses.map((o) => (
              <li key={o._id} className="py-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-slate-600">{o.date} · {o.outTime}{o.expectedInTime ? ` – ${o.expectedInTime}` : ""}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-sm text-slate-700">{o.reason}</p>
                {o.reviewedBy && <p className="text-xs text-slate-400 mt-1">Reviewed by {o.reviewedBy.name}</p>}
              </li>
            ))}
            {outPasses.length === 0 && <p className="text-slate-400 text-sm py-4">No requests yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApplyOutPass;