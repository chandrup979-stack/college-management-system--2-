import { useEffect, useState } from "react";
import api from "../services/api";

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const ReviewOutPass = () => {
  const [outPasses, setOutPasses] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");

  const loadData = async (status) => {
    try {
      const query = status === "all" ? "" : `?status=${status}`;
      const { data } = await api.get(`/outpass${query}`);
      setOutPasses(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load out-pass requests");
    }
  };

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  const handleReview = async (id, status) => {
    try {
      await api.put(`/outpass/${id}/review`, { status });
      loadData(filter);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update request");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Out-Pass Requests</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}

      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              filter === s ? "bg-ink-900 text-white" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-3xl">
        {outPasses.length === 0 ? (
          <p className="text-slate-500">No requests found.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {outPasses.map((o) => (
              <li key={o._id} className="py-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium">{o.requestedBy?.name} <span className="text-xs text-slate-400 capitalize">({o.requesterRole})</span></p>
                    <p className="text-xs text-slate-500">{o.date} · {o.outTime}{o.expectedInTime ? ` – ${o.expectedInTime}` : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-sm text-slate-700 mb-2">{o.reason}</p>
                {o.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleReview(o._id, "approved")} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition">
                      Approve
                    </button>
                    <button onClick={() => handleReview(o._id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition">
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReviewOutPass;