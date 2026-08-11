import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import { Upload, Download } from "lucide-react";

const years = ["1st Year", "2nd Year", "3rd Year"];

const BulkImportStudents = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/departments"), api.get("/courses")]).then(([d, c]) => {
      setDepartments(d.data);
      setCourses(c.data);
      if (d.data.length === 1) setDepartment(d.data[0]._id);
      if (c.data.length === 1) setCourse(c.data[0]._id);
    });
  }, []);

  const downloadTemplate = () => {
    const sample = [
      {
        name: "Anitha K",
        email: "anitha.k@example.com",
        password: "student123",
        rollNumber: "23CT001",
        year: "1st Year",
        phone: "9876543210",
        batch: "2023-2027",
        parentContact: "9876500000",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_import_template.xlsx");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setResults(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (data.length === 0) {
          setError("The file appears to be empty");
          return;
        }
        setRows(data);
      } catch (err) {
        setError("Could not read this file. Make sure it's a valid .xlsx or .csv file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (rows.length === 0) {
      setError("Choose a file with student rows first");
      return;
    }
    setError("");
    setImporting(true);
    try {
      const { data } = await api.post("/users/students/bulk", {
        department,
        course,
        students: rows,
      });
      setResults(data);
      setRows([]);
      setFileName("");
    } catch (err) {
      setError(err.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-2">Bulk Import Students</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xl">
        Upload an Excel or CSV file to add many students at once, instead of one at a time.
      </p>

      {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded-lg mb-4 max-w-xl border border-red-100">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">1. Prepare &amp; Upload</h2>

          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-sm text-ink-700 hover:underline mb-4"
          >
            <Download size={16} />
            Download Excel template
          </button>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Department (applies to all rows)</option>
              {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Course (applies to all rows)</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-6 cursor-pointer hover:border-ink-700 transition text-sm text-slate-500">
            <Upload size={18} />
            {fileName || "Click to choose .xlsx or .csv file"}
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
          </label>

          {rows.length > 0 && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full mt-4 bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition text-sm font-medium disabled:opacity-50"
            >
              {importing ? "Importing..." : `Import ${rows.length} Student${rows.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4">2. Preview / Results</h2>

          {results ? (
            <div>
              <p className="text-sm text-green-700 mb-2">
                ✓ {results.created.length} student{results.created.length !== 1 ? "s" : ""} created successfully
              </p>
              {results.failed.length > 0 && (
                <>
                  <p className="text-sm text-red-700 mb-2">✗ {results.failed.length} failed:</p>
                  <ul className="text-xs text-slate-600 space-y-1 max-h-64 overflow-y-auto">
                    {results.failed.map((f, i) => (
                      <li key={i} className="bg-red-50 rounded px-2 py-1">
                        {f.row?.name || f.row?.email || "Row"} — {f.reason}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : rows.length > 0 ? (
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="py-1 pr-2">Name</th>
                    <th className="py-1 pr-2">Email</th>
                    <th className="py-1 pr-2">Roll No.</th>
                    <th className="py-1 pr-2">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((r, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-1 pr-2">{r.name}</td>
                      <td className="py-1 pr-2">{r.email}</td>
                      <td className="py-1 pr-2">{r.rollNumber}</td>
                      <td className="py-1 pr-2">{r.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 20 && <p className="text-xs text-slate-400 mt-2">...and {rows.length - 20} more rows</p>}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Upload a file to see a preview here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportStudents;