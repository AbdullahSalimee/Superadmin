"use client";
import { useState } from "react";
import { Check, X as XIcon } from "lucide-react";
import type { Student, FeeRecord } from "@/lib/queries/types";
import { setFeeStatus, upsertFeeRecord } from "@/lib/queries/academy-attendance-fees";
import { shortId, fmtRs } from "@/lib/format";

export default function FeesModule({
  academyId, students, fees, setFees, month, year,
}: {
  academyId: string;
  students: Student[];
  fees: FeeRecord[];
  setFees: (fn: (p: FeeRecord[]) => FeeRecord[]) => void;
  month: number;
  year: number;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const feeByStudent = Object.fromEntries(fees.map((f) => [f.student_id, f]));
  const active = students.filter((s) => s.status === "active");

  const toggle = async (record: FeeRecord) => {
    setBusy(record.id);
    const next = record.status === "paid" ? "unpaid" : "paid";
    await setFeeStatus(record.id, next);
    setFees((p) => p.map((f) => (f.id === record.id ? { ...f, status: next } : f)));
    setBusy(null);
  };

  const createForStudent = async (s: Student) => {
    if (s.monthly_fee == null) { alert("Set this student's monthly_fee first (Students tab)."); return; }
    setBusy(s.id);
    await upsertFeeRecord(academyId, s.id, month, year, s.monthly_fee);
    window.location.reload();
  };

  const collected = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + Number(f.amount_due), 0);
  const due = fees.filter((f) => f.status === "unpaid").reduce((sum, f) => sum + Number(f.amount_due), 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: "10px 16px" }}>
          <div className="data" style={{ fontSize: 16, fontWeight: 700, color: "var(--grn)" }}>{fmtRs(collected)}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--t3)" }}>collected · {month}/{year}</div>
        </div>
        <div className="card" style={{ padding: "10px 16px" }}>
          <div className="data" style={{ fontSize: 16, fontWeight: 700, color: "var(--amb)" }}>{fmtRs(due)}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--t3)" }}>due · {month}/{year}</div>
        </div>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th className="mono">student_id</th>
            <th className="mono">name</th>
            <th className="mono">monthly_fee</th>
            <th className="mono">amount_due</th>
            <th className="mono">status</th>
            <th className="mono"></th>
          </tr>
        </thead>
        <tbody>
          {active.map((s) => {
            const f = feeByStudent[s.id];
            return (
              <tr key={s.id}>
                <td className="mono" style={{ fontSize: 10.5, color: "var(--t3)" }}>{shortId(s.id)}</td>
                <td  style={{ fontWeight: 600 }}>{s.name}</td>
                <td className="mono">{s.monthly_fee != null ? fmtRs(s.monthly_fee) : <span style={{ color: "var(--amb)" }}>not_set</span>}</td>
                <td className="mono">{f ? fmtRs(Number(f.amount_due)) : "—"}</td>
                <td >
                  {f ? <span className={`badge badge-${f.status === "paid" ? "active" : "trial"}`}>{f.status}</span> : <span style={{ color: "var(--t3)", fontSize: 11 }}>no record</span>}
                </td>
                <td >
                  {f ? (
                    <button className="btn btn-ghost btn-sm" disabled={busy === f.id} onClick={() => toggle(f)}>
                      {f.status === "paid" ? <XIcon size={11} /> : <Check size={11} />} mark {f.status === "paid" ? "unpaid" : "paid"}
                    </button>
                  ) : (
                    <button className="btn btn-ghost btn-sm" disabled={busy === s.id} onClick={() => createForStudent(s)}>insert record</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
