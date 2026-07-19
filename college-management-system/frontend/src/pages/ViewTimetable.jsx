import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const years = ["1st Year", "2nd Year", "3rd Year"];

const ViewTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("1st Year");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "student") {
      api
        .get("/timetable/me")
        .then((res) => setTimetable(res.data))
        .catch((err) => setError(err.response?.data?.message || "Failed to load timetable"));
    } else {
      api.get("/courses").then((res) => {
        setCourses(res.data);
        if (res.data.length === 1) setCourse(res.data[0]._id);
      });
    }
  }, [user]);

  const loadForCourse = async () => {
    if (!course || !year) return;
    try {
      const { data } = await api.get(`/timetable?course=${course}&year=${encodeURIComponent(year)}`);
      setTimetable(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load timetable");
    }
  };

  useEffect(() => {
    if (user?.role !== "student") loadForCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, year]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Timetable</h1>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}

      {user?.role !== "student" && (
        <div className="flex gap-4 mb-6 max-w-xl">
          <select value={course} onChange={(e) => setCourse(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Select course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-3xl">
        {timetable.length === 0 ? (
          <p className="text-slate-500">No timetable available.</p>
        ) : (
          timetable.map((t) => (
            <div key={t._id} className="mb-4">
              <h4 className="font-semibold text-ink-900 mb-1">{t.day}</h4>
              <ul className="text-sm text-slate-600 divide-y divide-slate-100">
                {t.slots.map((s, i) => (
                  <li key={i} className="py-1">
                    {s.time} — {s.subject?.name} ({s.faculty?.user?.name || "TBD"})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewTimetable;