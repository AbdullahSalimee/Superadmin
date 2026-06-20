"use client";
import Link from "next/link";
import { Building2, Users, TrendingUp, AlertTriangle, ArrowUpRight, ChevronRight, Zap, DollarSign, Activity, LogIn } from "lucide-react";
import { ACADEMIES, PALETTES } from "@/lib/data";

const fmtM = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(0)}K` : `${n}`;
const fmtRs = (n: number) => `Rs. ${fmtM(n)}`;

export default function DashboardPage() {
  const acs = ACADEMIES;
  const totalRev = acs.reduce((s,a) => s + a.revenueMonth, 0);
  const totalDue = acs.reduce((s,a) => s + a.dueMonth, 0);
  const totalStu = acs.reduce((s,a) => s + a.students, 0);
  const totalStaff = acs.reduce((s,a) => s + a.admins + a.teachers, 0);
  const rate = Math.round(totalRev / (totalRev + totalDue) * 100);

  const kpis = [
    { label: 'Total Academies', val: acs.length, sub: `${acs.filter(a=>a.status==='active').length} active`, icon: Building2, color: 'var(--blu)', dim: 'var(--blu-dim)' },
    { label: 'Platform Revenue', val: fmtRs(totalRev), sub: 'Collected this month', icon: TrendingUp, color: 'var(--grn)', dim: 'var(--grn-dim)' },
    { label: 'Total Due', val: fmtRs(totalDue), sub: 'Uncollected this month', icon: DollarSign, color: 'var(--amb)', dim: 'var(--amb-dim)' },
    { label: 'Total Students', val: totalStu.toLocaleString(), sub: 'Platform-wide', icon: Users, color: 'var(--vio)', dim: 'var(--vio-dim)' },
    { label: 'Total Staff', val: totalStaff, sub: 'Admins + teachers', icon: Activity, color: 'var(--cyn)', dim: 'var(--cyn-dim)' },
    { label: 'Collection Rate', val: `${rate}%`, sub: 'This month', icon: Zap, color: 'var(--grn)', dim: 'var(--grn-dim)' },
  ];

  return (
    <div style={{ padding: '28px 28px 40px' }}>

      {/* ── Page header ── */}
      <div className="anim-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Platform Console</div>
          <h1 className="display">Overview</h1>
          <p className="body" style={{ marginTop: 6 }}>
            Real-time summary across {acs.length} academies on the platform
          </p>
        </div>
        <Link href="/dashboard/academies">
          <button className="btn btn-primary">
            <Building2 size={14} /> Add Academy
          </button>
        </Link>
      </div>

      {/* ── KPI Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className={`card card-hover anim-up d${i+1}`}
            style={{ padding: 22, position: 'relative', overflow: 'hidden' }}
          >
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 20, right: 20, height: 1, background: `linear-gradient(90deg, transparent, ${k.color}, transparent)`, opacity: 0.4 }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: k.dim, border: `1px solid ${k.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <k.icon size={16} color={k.color} strokeWidth={2} />
              </div>
              <ArrowUpRight size={13} color="var(--t3)" />
            </div>

            <div className="stat-num" style={{ color: k.color, marginBottom: 6 }}>{k.val}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* Academy table */}
        <div className="card anim-up d4" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
            <div>
              <div className="title">Academy Leaderboard</div>
              <div className="body" style={{ marginTop: 2, fontSize: 12 }}>Ranked by monthly revenue</div>
            </div>
            <Link href="/dashboard/academies">
              <button className="btn btn-ghost btn-sm">View all <ChevronRight size={12} /></button>
            </Link>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Academy</th>
                <th>Status</th>
                <th>Students</th>
                <th>Revenue</th>
                <th>Due</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...acs].sort((a,b) => b.revenueMonth - a.revenueMonth).map((ac, i) => {
                const [c1] = PALETTES[ac.colorIdx % PALETTES.length];
                return (
                  <tr key={ac.id}>
                    <td style={{ color: 'var(--t3)', fontWeight: 700, fontSize: 11, width: 32 }}>{i+1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, borderRadius: 8, background: `${c1}22`, color: c1, border: `1px solid ${c1}33` }}>
                          {ac.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: 13 }}>{ac.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--t3)' }}>{ac.city}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge badge-${ac.status}`}>{ac.status}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--t1)' }}>{ac.students}</td>
                    <td style={{ fontWeight: 700, color: 'var(--grn)', fontVariantNumeric: 'tabular-nums' }}>
                      {ac.revenueMonth > 0 ? fmtRs(ac.revenueMonth) : <span style={{ color: 'var(--t3)' }}>—</span>}
                    </td>
                    <td style={{ color: ac.dueMonth > 0 ? 'var(--amb)' : 'var(--t3)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {ac.dueMonth > 0 ? fmtRs(ac.dueMonth) : '—'}
                    </td>
                    <td>
                      <Link href={`/dashboard/academies?enter=${ac.id}`}>
                        <button className="btn btn-ghost btn-sm" style={{ gap: 5, padding: '5px 10px' }}>
                          <LogIn size={11} /> Enter
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Quick actions */}
          <div className="card anim-up d5" style={{ padding: 18 }}>
            <div className="label" style={{ marginBottom: 14 }}>Quick Actions</div>
            {[
              { label: 'Add Academy', desc: 'Onboard a new tenant', icon: Building2, href: '/dashboard/academies', color: 'var(--blu)' },
              { label: 'View Analytics', desc: 'Revenue & performance', icon: BarChart3, href: '/dashboard/analytics', color: 'var(--vio)' },
              { label: 'Staff Overview', desc: 'Admins & teachers', icon: Users, href: '/dashboard/staff', color: 'var(--grn)' },
            ].map(a => (
              <Link key={a.label} href={a.href}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px', borderRadius: 10, cursor: 'pointer',
                  transition: 'background 0.12s', marginBottom: 2
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: `${a.color}14`, border: `1px solid ${a.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <a.icon size={14} color={a.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.2 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{a.desc}</div>
                  </div>
                  <ChevronRight size={13} color="var(--t3)" />
                </div>
              </Link>
            ))}
          </div>

          {/* Alerts */}
          <div className="card anim-up d6" style={{ padding: 18 }}>
            <div className="label" style={{ marginBottom: 14 }}>Platform Alerts</div>
            {[
              { msg: 'Roots Academy suspended — overdue license', type: 'red' },
              { msg: '1 academy in trial — needs conversion', type: 'amb' },
              { msg: 'Rs. 583K uncollected across 2 inactive academies', type: 'amb' },
            ].map((alert, i) => (
              <div key={i} style={{
                display: 'flex', gap: 9, padding: '10px 11px', borderRadius: 9, marginBottom: i < 2 ? 8 : 0,
                background: `var(--${alert.type}-dim)`,
                border: `1px solid rgba(${alert.type==='red' ? '255,91,91' : '245,166,35'},0.15)`,
              }}>
                <AlertTriangle size={13} color={`var(--${alert.type})`} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>{alert.msg}</span>
              </div>
            ))}
          </div>

          {/* Collection rate bar */}
          <div className="card anim-up d6" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="label">Collection Rate</div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: rate > 80 ? 'var(--grn)' : 'var(--amb)' }}>{rate}%</div>
            </div>
            <div className="prog-track" style={{ height: 6, marginBottom: 10 }}>
              <div className="prog-fill" style={{ width: `${rate}%`, background: rate > 80 ? 'linear-gradient(90deg, var(--grn), #5DF0A4)' : 'linear-gradient(90deg, var(--amb), #FFD066)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Collected: {fmtRs(totalRev)}</span>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Due: {fmtRs(totalDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChart3({ size, color }: { size: number, color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}
