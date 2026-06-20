"use client";
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import type { AcademyRole, StaffRole } from "@/lib/queries/types";
import { resetRolePassword } from "@/lib/queries/academies";
import { shortId } from "@/lib/format";

export default function CredentialsModule({
  academyId, initialRoles,
}: {
  academyId: string;
  initialRoles: AcademyRole[];
}) {
  const [show, setShow] = useState<Record<StaffRole, boolean>>({ admin: false, teacher: false });
  const [newPw, setNewPw] = useState<Record<StaffRole, string>>({ admin: "", teacher: "" });
  const [busy, setBusy] = useState<StaffRole | null>(null);

  const reset = async (role: StaffRole) => {
    const pw = newPw[role];
    if (!pw || pw.length < 4) { alert("Enter a password (min 4 chars)."); return; }
    setBusy(role);
    await resetRolePassword(academyId, role, pw);
    setBusy(null);
    setNewPw((p) => ({ ...p, [role]: "" }));
    alert(`${role} password updated — takes effect on next login.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13, maxWidth: 480 }}>
      {(["admin", "teacher"] as StaffRole[]).map((role) => {
        const row = initialRoles.find((r) => r.role === role);
        return (
          <div key={role} style={{ padding: 15, borderRadius: "var(--r-md)", background: "var(--raised)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
              <div className="label">role = &apos;{role}&apos;</div>
              <span className="badge badge-active" style={{ fontSize: 9 }}>shared credential</span>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--t3)", marginBottom: 8 }}>row_id: {row ? shortId(row.id) : "—"}</div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <input
                className="input"
                type={show[role] ? "text" : "password"}
                placeholder={`set new ${role} password`}
                value={newPw[role]}
                onChange={(e) => setNewPw((p) => ({ ...p, [role]: e.target.value }))}
                style={{ paddingRight: 36, fontFamily: "var(--font-mono)" }}
              />
              <button onClick={() => setShow((p) => ({ ...p, [role]: !p[role] }))} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--t3)", display: "flex" }}>
                {show[role] ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", gap: 7 }} onClick={() => reset(role)} disabled={busy === role}>
              <KeyRound size={11} /> {busy === role ? "writing…" : `reset ${role} password`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
