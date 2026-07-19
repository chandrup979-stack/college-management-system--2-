import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const NoticeBoard = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", targetRole: "all" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const { data } = await api.get("/announcements");
      setAnnouncements(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load announcements");
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
      await api.post("/announcements", form);
      setForm({ title: "", message: "", targetRole: "all" });
      setSuccess("Announcement posted");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post announcement");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await api.delete(`/announcements/${id}`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notice Board</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-xl">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 max-w-xl">{success}</p>}

      <div className={user?.role === "admin" ? "grid md:grid-cols-2 gap-6" : "max-w-2xl"}>
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Post Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <select
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">Everyone</option>
                <option value="students">Students only</option>
                <option value="faculty">Faculty only</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Post Announcement
              </button>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-700 mb-3">
            {user?.role === "admin" ? `All Announcements (${announcements.length})` : "Announcements"}
          </h3>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {announcements.map((a) => (
                <li key={a._id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {a.postedBy?.name} — {new Date(a.createdAt).toLocaleDateString()}
                        {a.targetRole !== "all" && ` — for ${a.targetRole}`}
                      </p>
                    </div>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => deleteAnnouncement(a._id)}
                        className="text-red-600 text-sm hover:underline ml-4"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;