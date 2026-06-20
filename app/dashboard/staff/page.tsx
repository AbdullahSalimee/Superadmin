"use client";
import { useState } from "react";
import { ACADEMIES, ACADEMY_ROLES, SESSION_LOGS, colorOf, shortId } from "@/lib/data";
import { Users, Shield, GraduationCap, Search, Building2, Wifi, WifiOff } from "lucide-react";

export default function StaffPage() {
  const acs = ACADEMIES;
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const totalAdmins = ACADEMY_ROLES.filter(r => r.role === 'admin').length;
  const totalTeachers = ACADEMY_ROLES.filter(r => r.role === 'teacher').length;
  const activeNow = SESSION_LOGS.filter(s => s.is_active).length;

  const rows = ACADEMY_ROLES.map(r => {
    const academy = acs.find(a => a.id === r.academy_id)!;
    const lastSession = [...SESSION_LOGS]
      .filter(s => s.academy_id === r.academy_id && s.role === r.role)
      .sort((a, b) => +new Date(b.logged_in_at) - +new Date(a.logged_in_at))[0];
    return { role: r, academy, lastSession };
  }).filter(r => {
    const ms = r.academy.name.toLowerCase().includes(q.toLowerCase());
    const mr = roleFilter === 'all' || r.role.role === roleFilter;
    return ms && mr;
  });

  return (
    <div style={{ padding: '24px 24px 40px' }}>
      <div className="anim-up" style={{ marginBottom: 22 }}>
        <div className="label" style={{ marginBottom: 6 }}>platform / staff</div>
        <h1 className="display">Staff &amp; Admins</h1>
        <p className="body mono" style={{ marginTop: 5, fontSize: 12 }}>select * from academy_roles — {ACADEMY_ROLES.length} rows across {acs.length} academies</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'role_rows', val: ACADEMY_ROLES.length, icon: Users, color: 'var(--acc)', dim: 'var(--acc-dim)' },
          { label: 'admin', val: totalAdmins, icon: Shield, color: 'var(--vio)', dim: 'var(--vio-dim)' },
          { label: 'teacher', val: totalTeachers, icon: GraduationCap, color: 'var(--cyn)', dim: 'var(--cyn-dim)' },
          { label: 'sessions.active', val: activeNow, icon: Wifi, color: 'var(--grn)', dim: 'var(--grn-dim)' },
        ].map((s, i) => (
          <div key={s.label} className={`card card-hover anim-up d${i+1}`} style={{ padding: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: s.dim, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 13 }}>
              <s.icon size={14} color={s.color} />
            </div>
            <div className="data" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="anim-up d3" style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={12} color="var(--t3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" placeholder="search academy…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all','admin','teacher'].map(r => (
            <button key={r} className={`chip${roleFilter===r?' on':''}`} onClick={() => setRoleFilter(r)}>{r}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card anim-up d4" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <div className="title" style={{ marginBottom: 3 }}>academy_roles</div>
          <p className="body mono" style={{ fontSize: 11 }}>shared-credential model — one password_hash row per (academy_id, role)</p>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>academy</th>
              <th>role</th>
              <th>row_id</th>
              <th>academy.status</th>
              <th>last_login</th>
              <th>session</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const [c1] = colorOf(r.academy.id);
              return (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 24, height: 24, fontSize: 9.5, background: `${c1}1a`, color: c1, border: `1px solid ${c1}40` }}>
                        {r.academy.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--t1)', fontSize: 12.5 }}>{r.academy.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {r.role.role === 'admin' ? <Shield size={11} color="var(--vio)" /> : <GraduationCap size={11} color="var(--cyn)" />}
                      <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: r.role.role === 'admin' ? 'var(--vio)' : 'var(--cyn)' }}>{r.role.role}</span>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--t3)' }}>{shortId(r.role.id)}</td>
                  <td><span className={`badge badge-${r.academy.status}`}>{r.academy.status}</span></td>
                  <td className="mono" style={{ fontSize: 11.5, color: 'var(--t2)' }}>
                    {r.lastSession ? new Date(r.lastSession.logged_in_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td>
                    {r.academy.status === 'suspended' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: 'var(--red)' }}>
                        <WifiOff size={11} /> blocked
                      </span>
                    ) : r.lastSession?.is_active ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: 'var(--grn)' }}>
                        <Wifi size={11} /> online
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--t3)' }}>
                        <WifiOff size={11} /> offline
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Building2 size={26} color="var(--t3)" style={{ margin: '0 auto 10px' }} />
            <p className="body mono" style={{ fontSize: 11.5 }}>no matching rows</p>
          </div>
        )}
      </div>
    </div>
  );
}
