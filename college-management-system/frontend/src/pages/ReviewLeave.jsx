import { useEffect, useState } from "react";
import api from "../services/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const ReviewLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");

  const loadData = async (status) => {
    try {
      const query = status === "all" ? "" : `?status=${status}`;
      const { data } = await api.get(`/leave${query}`);
      setLeaves(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leave requests");
    }
  };

  useEffect(() => {
    loadData(filter);
  }, [filter]);

  const handleReview = async (id, status) => {
    try {
      await api.put(`/leave/${id}/review`, { status });
      loadData(filter);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave Requests</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}

      <div className="flex gap-2 mb-6">
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded capitalize ${
              filter === s ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
        {leaves.length === 0 ? (
          <p className="text-gray-500">No leave requests found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {leaves.map((l) => (
              <li key={l._id} className="py-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium">{l.student?.user?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(l.fromDate).toLocaleDateString()} — {new Date(l.toDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[l.status]}`}>
                    {l.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{l.reason}</p>
                {l.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(l._id, "approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(l._id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                    >
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

export default ReviewLeave;