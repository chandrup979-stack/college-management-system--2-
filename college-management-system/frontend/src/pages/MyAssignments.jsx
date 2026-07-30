import { useEffect, useState } from "react";
import api from "../services/api";

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const { data } = await api.get("/assignments/me");
      setAssignments(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assignments");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (id) => {
    setError("");
    setSuccess("");
    const file = files[id];
    if (!file) {
      setError("Choose a file before submitting");
      return;
    }
    try {
      setUploadingId(id);
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await api.post(`/assignments/${id}/submit`, { fileUrl: uploadRes.data.url });
      setSuccess("Submitted successfully");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
    } finally {
      setUploadingId(null);
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">My Assignments</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-green-100">{success}</p>}

      <div className="space-y-4 max-w-2xl">
        {assignments.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500">No assignments yet.</p>
          </div>
        ) : (
          assignments.map((a) => (
            <div key={a._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-ink-900">{a.title}</h3>
                  <p className="text-xs text-slate-500">{a.subject?.name}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    a.submitted
                      ? "bg-green-50 text-green-700"
                      : isOverdue(a.dueDate)
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {a.submitted ? "Submitted" : isOverdue(a.dueDate) ? "Overdue" : "Pending"}
                </span>
              </div>

              {a.description && <p className="text-sm text-slate-600 mb-2">{a.description}</p>}

              <p className="text-xs text-slate-500 mb-3">
                Due: {new Date(a.dueDate).toLocaleDateString()}
                {a.fileUrl && (
                  <>
                    {" "}
                    —{" "}
                    <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-ink-700 hover:underline">
                      Download assignment file
                    </a>
                  </>
                )}
              </p>

              {a.submitted ? (
                <p className="text-sm text-slate-600">
                  Your submission:{" "}
                  <a href={a.mySubmission.fileUrl} target="_blank" rel="noreferrer" className="text-ink-700 hover:underline">
                    View your submitted file
                  </a>
                </p>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    onChange={(e) => setFiles({ ...files, [a._id]: e.target.files[0] })}
                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-ink-900 file:text-white file:text-xs"
                  />
                  <button
                    onClick={() => handleSubmit(a._id)}
                    disabled={uploadingId === a._id}
                    className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm disabled:opacity-50 shrink-0"
                  >
                    {uploadingId === a._id ? "Uploading..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAssignments;