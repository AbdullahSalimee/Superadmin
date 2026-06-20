"use client";
import { useState } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import type { ClassRow, SubjectRow } from "@/lib/queries/types";
import { createClass, deleteClass, createSubject, deleteSubject } from "@/lib/queries/academy-core";
import { shortId } from "@/lib/format";

export default function ClassesModule({
  academyId, classes, subjects, setClasses, setSubjects,
}: {
  academyId: string;
  classes: ClassRow[];
  subjects: SubjectRow[];
  setClasses: (fn: (p: ClassRow[]) => ClassRow[]) => void;
  setSubjects: (fn: (p: SubjectRow[]) => SubjectRow[]) => void;
}) {
  const [classModal, setClassModal] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const addClass = async () => {
    if (!className) return;
    await createClass(academyId, className, section || null);
    window.location.reload();
  };
  const removeClass = async (c: ClassRow) => {
    if (!confirm(`Delete class "${c.name}"? Fails if students still reference it.`)) return;
    try { await deleteClass(c.id); setClasses((p) => p.filter((x) => x.id !== c.id)); }
    catch (e) { alert((e as Error).message); }
  };
  const addSubject = async () => {
    if (!subjectName) return;
    await createSubject(academyId, subjectName);
    window.location.reload();
  };
  const removeSubject = async (s: SubjectRow) => {
    if (!confirm(`Delete subject "${s.name}"?`)) return;
    try { await deleteSubject(s.id); setSubjects((p) => p.filter((x) => x.id !== s.id)); }
    catch (e) { alert((e as Error).message); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <h4 className="label">classes</h4>
          <button className="btn btn-ghost btn-sm" onClick={() => setClassModal(true)}><Plus size={11} /> insert</button>
        </div>
        <table className="tbl">
          <thead><tr><th className="mono">id</th><th className="mono">name</th><th className="mono">section</th><th className="mono"></th></tr></thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{shortId(c.id)}</td>
                <td >{c.name}</td>
                <td className="mono">{c.section ?? "—"}</td>
                <td ><button className="btn-icon" onClick={() => removeClass(c)}><Trash2 size={12} color="var(--red)" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <h4 className="label">subjects</h4>
          <button className="btn btn-ghost btn-sm" onClick={() => setSubjectModal(true)}><Plus size={11} /> insert</button>
        </div>
        <table className="tbl">
          <thead><tr><th className="mono">id</th><th className="mono">name</th><th className="mono"></th></tr></thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{shortId(s.id)}</td>
                <td >{s.name}</td>
                <td ><button className="btn-icon" onClick={() => removeSubject(s)}><Trash2 size={12} color="var(--red)" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {classModal && (
        <div style={{ position: "fixed", inset: 0, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setClassModal(false)}>
          <div className="card" style={{ width: 360 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
              <h3 className="title" style={{ fontSize: 14 }}>insert into classes</h3>
              <button className="btn-icon" onClick={() => setClassModal(false)}><X size={13} /></button>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="label" style={{ display: "block", marginBottom: 6 }}>name *</label><input className="input" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. 9th" /></div>
              <div><label className="label" style={{ display: "block", marginBottom: 6 }}>section</label><input className="input" value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. blue" /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setClassModal(false)}>cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={addClass}><Check size={12} /> insert</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subjectModal && (
        <div style={{ position: "fixed", inset: 0, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setSubjectModal(false)}>
          <div className="card" style={{ width: 360 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
              <h3 className="title" style={{ fontSize: 14 }}>insert into subjects</h3>
              <button className="btn-icon" onClick={() => setSubjectModal(false)}><X size={13} /></button>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="label" style={{ display: "block", marginBottom: 6 }}>name *</label><input className="input" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="e.g. Physics" /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSubjectModal(false)}>cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={addSubject}><Check size={12} /> insert</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
