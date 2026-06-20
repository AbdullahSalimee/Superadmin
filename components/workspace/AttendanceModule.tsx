"use client";
import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import type { ClassRow, Student, AttendanceStatus } from "@/lib/queries/types";
import { getAttendanceForDate, saveAttendance } from "@/lib/queries/academy-attendance-fees";

const STATUS_COLOR: Record<AttendanceStatus, string> = { P: "var(--grn)", A: "var(--red)", L: "var(--amb)" };

export default function AttendanceModule({
  academyId, classes, students,
}: {
  academyId: string;
  classes: ClassRow[];
  students: Student[];
}) {
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const classStudents = students.filter((s) => s.class_id === classId && s.status === "active");

  const load = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    const existing = await getAttendanceForDate(academyId, classId, date);
    setMarks(existing);
    setLoading(false);
  }, [academyId, classId, date]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() is a shared reusable fetcher (also called after mutations to refresh), not effect-only logic
  useEffect(() => { load(); }, [load]);

  const setMark = (studentId: string, status: AttendanceStatus) =>
    setMarks((p) => ({ ...p, [studentId]: status }));

  const save = async () => {
    setSaving(true);
    const records = classStudents.map((s) => ({ studentId: s.id, status: marks[s.id] ?? "P" as AttendanceStatus }));
    await saveAttendance(academyId, classId, date, records);
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 220 }}>
          <label className="label" style={{ display: "block", marginBottom: 6 }}>class_id</label>
          <select className="input" value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}{c.section ? ` ${c.section}` : ""}</option>)}
          </select>
        </div>
        <div>
          <label className="label" style={{ display: "block", marginBottom: 6 }}>date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving || loading}>
          <Save size={12} /> {saving ? "writing…" : "save (upsert)"}
        </button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th className="mono">id</th>
            <th className="mono">roll_no</th>
            <th className="mono">name</th>
            <th className="mono">status</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={4} className="mono" style={{ textAlign: "center", padding: 20, color: "var(--t3)" }}>querying attendance_records…</td></tr>}
          {!loading && classStudents.map((s) => {
            const status = marks[s.id] ?? "P";
            return (
              <tr key={s.id}>
                <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{s.id.slice(0, 8)}…</td>
                <td className="mono">{s.roll_number}</td>
                <td  style={{ fontWeight: 600 }}>{s.name}</td>
                <td >
                  <div style={{ display: "flex", gap: 4 }}>
                    {(["P", "A", "L"] as AttendanceStatus[]).map((opt) => (
                      <button
                        key={opt}
                        className="mono"
                        onClick={() => setMark(s.id, opt)}
                        style={{
                          width: 26, height: 26, borderRadius: "var(--r-sm)", fontSize: 11, fontWeight: 700,
                          border: `1px solid ${status === opt ? STATUS_COLOR[opt] : "var(--line)"}`,
                          background: status === opt ? `${STATUS_COLOR[opt]}1A` : "transparent",
                          color: status === opt ? STATUS_COLOR[opt] : "var(--t3)", cursor: "pointer",
                        }}
                      >{opt}</button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
          {!loading && classStudents.length === 0 && (
            <tr><td colSpan={4} className="mono" style={{ textAlign: "center", color: "var(--t3)", padding: 24 }}>no active students in this class</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
