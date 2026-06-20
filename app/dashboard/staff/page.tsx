"use client";
import { useState } from "react";
import { ACADEMIES, PALETTES } from "@/lib/data";
import { Users, Shield, GraduationCap, Search, Building2 } from "lucide-react";

export default function StaffPage() {
  const acs = ACADEMIES;
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const totalAdmins = acs.reduce((s,a) => s + a.admins, 0);
  const totalTeachers = acs.reduce((s,a) => s + a.teachers, 0);

  const rows = acs.flatMap(a => [
    { academy: a, role: 'Admin' as const, count: a.admins },
    { academy: a, role: 'Teacher' as const, count: a.teachers },
  ]).filter(r => {
    const ms = r.academy.name.toLowerCase().includes(q.toLowerCase());
    const mr = roleFilter === 'All' || r.role === roleFilter;
    return ms && mr;
  });

  return (
    <div style={{ padding: '28px 28px 40px' }}>
      <div className="anim-up" style={{ marginBottom: 26 }}>
        <div className="label" style={{ marginBottom: 6 }}>Platform</div>
        <h1 className="display">Staff & Admins</h1>
        <p className="body" style={{ marginTop: 5 }}>{totalAdmins + totalTeachers} total staff across {acs.length} academies</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Staff', val: totalAdmins + totalTeachers, icon: Users, color: 'var(--blu)', dim: 'var(--blu-dim)' },
          { label: 'Admins', val: totalAdmins, icon: Shield, color: 'var(--vio)', dim: 'var(--vio-dim)' },
          { label: 'Teachers', val: totalTeachers, icon: GraduationCap, color: 'var(--grn)', dim: 'var(--grn-dim)' },
        ].map((s, i) => (
          <div key={s.label} className={`card card-hover anim-up d${i+1}`} style={{ padding: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: s.dim, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <s.icon size={15} color={s.color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="anim-up d3" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={13} color="var(--t3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" placeholder="Search academy…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All','Admin','Teacher'].map(r => (
            <button key={r} className={`chip${roleFilter===r?' on':''}`} onClick={() => setRoleFilter(r)}>{r}{r!=='All'?'s':''}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card anim-up d4" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div className="title" style={{ marginBottom: 3 }}>Staff Directory</div>
          <p className="body" style={{ fontSize: 12 }}>Shared-credential model — one Admin password and one Teacher password per academy</p>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Academy</th>
              <th>Role</th>
              <th>Headcount</th>
              <th>Academy Status</th>
              <th>Login Access</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const [c1] = PALETTES[r.academy.colorIdx % PALETTES.length];
              return (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 26, height: 26, borderRadius: 7, fontSize: 10, background: `${c1}22`, color: c1, border: `1px solid ${c1}33` }}>
                        {r.academy.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: 13 }}>{r.academy.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {r.role === 'Admin' ? <Shield size={12} color="var(--vio)" /> : <GraduationCap size={12} color="var(--grn)" />}
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.role === 'Admin' ? 'var(--vio)' : 'var(--grn)' }}>{r.role}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--t1)' }}>{r.count}</td>
                  <td><span className={`badge badge-${r.academy.status}`}>{r.academy.status}</span></td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.academy.status === 'suspended' ? 'var(--red)' : 'var(--grn)' }}>
                      {r.academy.status === 'suspended' ? 'Blocked' : 'Enabled'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Building2 size={28} color="var(--t3)" style={{ margin: '0 auto 10px' }} />
            <p className="body" style={{ fontSize: 12 }}>No matching staff records</p>
          </div>
        )}
      </div>
    </div>
  );
}
