"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, UserX, UserCheck, X, Check, Search } from "lucide-react";
import type { ClassRow, Student } from "@/lib/queries/types";
import { createStudent, updateStudent, setStudentStatus, deleteStudent, type StudentInput } from "@/lib/queries/academy-core";
import { shortId, fmtDate } from "@/lib/format";

const EMPTY: StudentInput = {
  class_id: "", roll_number: 0, name: "", father_name: "", monthly_fee: null,
  phone: "", address: "", teacher_remarks: "",
};

export default function StudentsModule({
  academyId, classes, students, setStudents,
}: {
  academyId: string;
  classes: ClassRow[];
  students: Student[];
  setStudents: (fn: (p: Student[]) => Student[]) => void;
}) {
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentInput>(EMPTY);
  const [busy, setBusy] = useState(false);

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));
  const visible = students.filter(
    (s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.id.includes(q.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({
      class_id: s.class_id, roll_number: s.roll_number, name: s.name,
      father_name: s.father_name, monthly_fee: s.monthly_fee, phone: s.phone,
      address: s.address, teacher_remarks: s.teacher_remarks,
    });
    setModal("edit");
  };

  const submit = async () => {
    if (!form.name || !form.class_id) return;
    setBusy(true);
    try {
      if (modal === "add") {
        await createStudent(academyId, form);
        // optimistic placeholder row removed on refresh; simplest correct
        // approach here is a full reload of the list from the server.
        window.location.reload();
      } else if (editing) {
        await updateStudent(editing.id, form);
        setStudents((p) => p.map((s) => (s.id === editing.id ? { ...s, ...form } as Student : s)));
        setModal(null);
      }
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (s: Student) => {
    const next = s.status === "active" ? "inactive" : "active";
    await setStudentStatus(s.id, next);
    setStudents((p) => p.map((x) => (x.id === s.id ? { ...x, status: next } : x)));
  };

  const remove = async (s: Student) => {
    if (!confirm(`Permanently delete ${s.name} (${shortId(s.id)})? This removes all related rows.`)) return;
    await deleteStudent(s.id);
    setStudents((p) => p.filter((x) => x.id !== s.id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 10 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--t3)" }} />
          <input className="input" placeholder="search name or student_id…" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={12} /> insert row</button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th className="mono">id</th>
            <th className="mono">name</th>
            <th className="mono">class</th>
            <th className="mono">roll_no</th>
            <th className="mono">monthly_fee</th>
            <th className="mono">status</th>
            <th className="mono">added_by</th>
            <th className="mono">created_at</th>
            <th className="mono"></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((s) => (
            <tr key={s.id}>
              <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{shortId(s.id)}</td>
              <td  style={{ fontWeight: 600 }}>{s.name}</td>
              <td className="mono" style={{ fontSize: 11.5 }}>{classMap[s.class_id] ? `${classMap[s.class_id].name}${classMap[s.class_id].section ? " " + classMap[s.class_id].section : ""}` : "—"}</td>
              <td className="mono">{s.roll_number}</td>
              <td className="mono">{s.monthly_fee != null ? `Rs ${s.monthly_fee}` : <span style={{ color: "var(--amb)" }}>not_set</span>}</td>
              <td ><span className={`badge badge-${s.status === "active" ? "active" : "suspended"}`}>{s.status}</span></td>
              <td className="mono" style={{ fontSize: 11 }}>{s.added_by_role}</td>
              <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{fmtDate(s.created_at)}</td>
              <td >
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <button className="btn-icon" title="edit" onClick={() => openEdit(s)}><Pencil size={12} /></button>
                  <button className="btn-icon" title={s.status === "active" ? "deactivate" : "reactivate"} onClick={() => toggleStatus(s)}>
                    {s.status === "active" ? <UserX size={12} /> : <UserCheck size={12} />}
                  </button>
                  <button className="btn-icon" title="delete" onClick={() => remove(s)}><Trash2 size={12} color="var(--red)" /></button>
                </div>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr><td colSpan={9} className="mono" style={{ textAlign: "center", color: "var(--t3)", padding: 24 }}>no rows</td></tr>
          )}
        </tbody>
      </table>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setModal(null)}>
          <div className="card" style={{ width: 440, maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
              <h3 className="title" style={{ fontSize: 14 }}>{modal === "add" ? "insert into students" : `update students where id = ${shortId(editing!.id)}`}</h3>
              <button className="btn-icon" onClick={() => setModal(null)}><X size={13} /></button>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="label" style={{ display: "block", marginBottom: 6 }}>class_id *</label>
                <select className="input" value={form.class_id} onChange={(e) => setForm((p) => ({ ...p, class_id: e.target.value }))}>
                  <option value="">select class…</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}{c.section ? ` ${c.section}` : ""}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label" style={{ display: "block", marginBottom: 6 }}>name *</label>
                  <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label" style={{ display: "block", marginBottom: 6 }}>roll_number *</label>
                  <input className="input" type="number" value={form.roll_number} onChange={(e) => setForm((p) => ({ ...p, roll_number: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="label" style={{ display: "block", marginBottom: 6 }}>father_name</label>
                <input className="input" value={form.father_name ?? ""} onChange={(e) => setForm((p) => ({ ...p, father_name: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label" style={{ display: "block", marginBottom: 6 }}>monthly_fee</label>
                  <input className="input" type="number" value={form.monthly_fee ?? ""} onChange={(e) => setForm((p) => ({ ...p, monthly_fee: e.target.value ? Number(e.target.value) : null }))} />
                </div>
                <div>
                  <label className="label" style={{ display: "block", marginBottom: 6 }}>phone</label>
                  <input className="input" value={form.phone ?? ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label" style={{ display: "block", marginBottom: 6 }}>address</label>
                <input className="input" value={form.address ?? ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="label" style={{ display: "block", marginBottom: 6 }}>teacher_remarks</label>
                <input className="input" value={form.teacher_remarks ?? ""} onChange={(e) => setForm((p) => ({ ...p, teacher_remarks: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(null)}>cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={submit} disabled={busy}>
                  <Check size={12} /> {busy ? "writing…" : modal === "add" ? "insert" : "save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
