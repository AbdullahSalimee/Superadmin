"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, X, Check, ArrowLeft } from "lucide-react";
import type { ClassRow, SubjectRow, Student, TestRow, TestResult } from "@/lib/queries/types";
import { createTest, deleteTest, getTestResults, saveTestResults } from "@/lib/queries/academy-tests";
import { shortId, fmtDate } from "@/lib/format";

export default function TestsModule({
  academyId, classes, subjects, students, tests, setTests,
}: {
  academyId: string;
  classes: ClassRow[];
  subjects: SubjectRow[];
  students: Student[];
  tests: TestRow[];
  setTests: (fn: (p: TestRow[]) => TestRow[]) => void;
}) {
  const [modal, setModal] = useState(false);
  const [activeTest, setActiveTest] = useState<TestRow | null>(null);
  const [form, setForm] = useState({ class_id: "", subject_id: "", name: "", date: new Date().toISOString().slice(0, 10), total_marks: 100 });

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  const create = async () => {
    if (!form.class_id || !form.subject_id || !form.name) return;
    await createTest(academyId, form);
    window.location.reload();
  };
  const remove = async (t: TestRow) => {
    if (!confirm(`Delete test "${t.name}"?`)) return;
    await deleteTest(t.id);
    setTests((p) => p.filter((x) => x.id !== t.id));
  };

  if (activeTest) {
    return <MarksEntry academyId={academyId} test={activeTest} students={students.filter((s) => s.class_id === activeTest.class_id && s.status === "active")} onBack={() => setActiveTest(null)} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><Plus size={12} /> insert row</button>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th className="mono">id</th>
            <th className="mono">name</th>
            <th className="mono">class</th>
            <th className="mono">subject</th>
            <th className="mono">total_marks</th>
            <th className="mono">date</th>
            <th className="mono"></th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id}>
              <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{shortId(t.id)}</td>
              <td  style={{ fontWeight: 600, cursor: "pointer" }} onClick={() => setActiveTest(t)}>{t.name}</td>
              <td className="mono" style={{ fontSize: 11.5 }}>{classMap[t.class_id]?.name ?? "—"}</td>
              <td className="mono" style={{ fontSize: 11.5 }}>{subjectMap[t.subject_id]?.name ?? "—"}</td>
              <td className="mono">{t.total_marks}</td>
              <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{fmtDate(t.date)}</td>
              <td >
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTest(t)}>enter marks</button>
                  <button className="btn-icon" onClick={() => remove(t)}><Trash2 size={12} color="var(--red)" /></button>
                </div>
              </td>
            </tr>
          ))}
          {tests.length === 0 && <tr><td colSpan={7} className="mono" style={{ textAlign: "center", color: "var(--t3)", padding: 24 }}>no rows</td></tr>}
        </tbody>
      </table>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setModal(false)}>
          <div className="card" style={{ width: 400 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
              <h3 className="title" style={{ fontSize: 14 }}>insert into tests</h3>
              <button className="btn-icon" onClick={() => setModal(false)}><X size={13} /></button>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="label" style={{ display: "block", marginBottom: 6 }}>name *</label><input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Monthly Test 1" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label className="label" style={{ display: "block", marginBottom: 6 }}>class_id *</label>
                  <select className="input" value={form.class_id} onChange={(e) => setForm((p) => ({ ...p, class_id: e.target.value }))}>
                    <option value="">select…</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}{c.section ? ` ${c.section}` : ""}</option>)}
                  </select>
                </div>
                <div><label className="label" style={{ display: "block", marginBottom: 6 }}>subject_id *</label>
                  <select className="input" value={form.subject_id} onChange={(e) => setForm((p) => ({ ...p, subject_id: e.target.value }))}>
                    <option value="">select…</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label className="label" style={{ display: "block", marginBottom: 6 }}>date</label><input className="input" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
                <div><label className="label" style={{ display: "block", marginBottom: 6 }}>total_marks</label><input className="input" type="number" value={form.total_marks} onChange={(e) => setForm((p) => ({ ...p, total_marks: Number(e.target.value) }))} /></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={create}><Check size={12} /> insert</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarksEntry({ academyId, test, students, onBack }: { academyId: string; test: TestRow; students: Student[]; onBack: () => void }) {
  const [results, setResults] = useState<Record<string, { marks: string; absent: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const existing: TestResult[] = await getTestResults(test.id);
    const map: Record<string, { marks: string; absent: boolean }> = {};
    for (const r of existing) map[r.student_id] = { marks: r.marks_obtained != null ? String(r.marks_obtained) : "", absent: r.is_absent };
    setResults(map);
    setLoading(false);
  }, [test.id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() is a shared reusable fetcher (also called after mutations to refresh), not effect-only logic
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = students.map((s) => {
      const r = results[s.id] ?? { marks: "", absent: false };
      return { studentId: s.id, marksObtained: r.absent ? null : (r.marks ? Number(r.marks) : null), isAbsent: r.absent };
    });
    await saveTestResults(academyId, test.id, payload);
    setSaving(false);
  };

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 14 }}><ArrowLeft size={12} /> back to tests</button>
      <div style={{ marginBottom: 14 }}>
        <h4 className="title" style={{ fontSize: 14 }}>{test.name} <span style={{ color: "var(--t3)", fontWeight: 400 }}>· total_marks = {test.total_marks}</span></h4>
      </div>
      <table className="tbl">
        <thead><tr><th className="mono">roll_no</th><th className="mono">name</th><th className="mono">marks_obtained</th><th className="mono">is_absent</th></tr></thead>
        <tbody>
          {loading && <tr><td colSpan={4} className="mono" style={{ textAlign: "center", padding: 20, color: "var(--t3)" }}>querying test_results…</td></tr>}
          {!loading && students.map((s) => {
            const r = results[s.id] ?? { marks: "", absent: false };
            return (
              <tr key={s.id}>
                <td className="mono">{s.roll_number}</td>
                <td  style={{ fontWeight: 600 }}>{s.name}</td>
                <td >
                  <input
                    className="input" type="number" disabled={r.absent} value={r.marks} style={{ width: 90 }}
                    onChange={(e) => setResults((p) => ({ ...p, [s.id]: { ...r, marks: e.target.value } }))}
                  />
                </td>
                <td >
                  <input type="checkbox" checked={r.absent} onChange={(e) => setResults((p) => ({ ...p, [s.id]: { ...r, absent: e.target.checked } }))} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 14 }}>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving || loading}><Check size={12} /> {saving ? "writing…" : "save results (upsert)"}</button>
      </div>
    </div>
  );
}
