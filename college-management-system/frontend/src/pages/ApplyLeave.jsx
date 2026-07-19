import { useEffect, useState } from "react";
import api from "../services/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const ApplyLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ reason: "", fromDate: "", toDate: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const { data } = await api.get("/leave/me");
      setLeaves(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leave requests");
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
      await api.post("/leave", form);
      setForm({ reason: "", fromDate: "", toDate: "" });
      setSuccess("Leave request submitted");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Apply for Leave</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 max-w-xl">{success}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">New Leave Request</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              placeholder="Reason for leave"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={form.fromDate}
                  onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={form.toDate}
                  onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-700 mb-2">My Requests ({leaves.length})</h3>
          <ul className="divide-y divide-gray-200">
            {leaves.map((l) => (
              <li key={l._id} className="py-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-gray-600">
                    {new Date(l.fromDate).toLocaleDateString()} — {new Date(l.toDate).toLocaleDateString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[l.status]}`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{l.reason}</p>
                {l.reviewedBy && (
                  <p className="text-xs text-gray-400 mt-1">
                    Reviewed by {l.reviewedBy.user?.name}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;