import { useEffect, useState } from "react";
import api from "../services/api";

const ManageAssignments = () => {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewingId, setViewingId] = useState(null);
  const [viewedAssignment, setViewedAssignment] = useState(null);

  const loadData = async () => {
    try {
      const [subRes, assignRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/assignments"),
      ]);
      setSubjects(subRes.data);
      setAssignments(assignRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
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
      let fileUrl = "";

      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileUrl = uploadRes.data.url;
        setUploading(false);
      }

      await api.post("/assignments", { ...form, fileUrl });
      setForm({ title: "", description: "", subject: "", dueDate: "" });
      setFile(null);
      setSuccess("Assignment created successfully");
      loadData();
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || "Failed to create assignment");
    }
  };

  const deleteAssignment = async (id) => {
    if (!confirm("Delete this assignment?")) return;
    await api.delete(`/assignments/${id}`);
    loadData();
  };

  const viewSubmissions = async (id) => {
    if (viewingId === id) {
      setViewingId(null);
      setViewedAssignment(null);
      return;
    }
    const { data } = await api.get(`/assignments/${id}`);
    setViewedAssignment(data);
    setViewingId(id);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Assignments</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">Create Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Attach file (optional)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-ink-900 file:text-white file:text-xs"
              />
            </div>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Create Assignment"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-medium text-slate-700 mb-2">
            Existing Assignments ({assignments.length})
          </h3>
          <ul className="divide-y divide-slate-100">
            {assignments.map((a) => (
              <li key={a._id} className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-slate-500">
                      {a.subject?.name} — Due: {new Date(a.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {a.submissions?.length || 0} submission(s)
                    </p>
                    {a.fileUrl && (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-ink-700 hover:underline">
                        View attached file
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewSubmissions(a._id)}
                      className="text-ink-700 text-sm hover:underline"
                    >
                      {viewingId === a._id ? "Hide" : "View"}
                    </button>
                    <button
                      onClick={() => deleteAssignment(a._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {viewingId === a._id && viewedAssignment && (
                  <div className="mt-2 bg-slate-50 rounded-lg p-3 text-sm">
                    {viewedAssignment.submissions.length === 0 ? (
                      <p className="text-slate-500">No submissions yet.</p>
                    ) : (
                      <ul className="space-y-1">
                        {viewedAssignment.submissions.map((s, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{s.student?.user?.name || "Unknown student"}</span>
                            <a
                              href={s.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-ink-700 hover:underline"
                            >
                              View submission
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageAssignments;