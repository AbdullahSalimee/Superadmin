"use client";
import Link from "next/link";
import { Building2, Users, TrendingUp, AlertTriangle, ArrowUpRight, ChevronRight, Zap, DollarSign, Activity, LogIn, GitBranch } from "lucide-react";
import { ACADEMIES, feesOf, studentsOf, staffCountOf, colorOf, shortId, CURRENT_MONTH, CURRENT_YEAR } from "@/lib/data";

const fmtM = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(0)}K` : `${n}`;
const fmtRs = (n: number) => `Rs ${fmtM(n)}`;

export default function DashboardPage() {
  const acs = ACADEMIES;
  const fees = acs.map(a => ({ a, fee: feesOf(a.id), stu: studentsOf(a.id) }));
  const totalRev = fees.reduce((s, x) => s + x.fee.collected, 0);
  const totalDue = fees.reduce((s, x) => s + x.fee.due, 0);
  const totalStu = fees.reduce((s, x) => s + x.stu.active_count, 0);
  const totalStaff = acs.reduce((s, a) => s + staffCountOf(a.id) * 2, 0); // admin + teacher seats
  const rate = Math.round(totalRev / (totalRev + totalDue) * 100);

  const kpis = [
    { label: 'academies', val: acs.length, sub: `${acs.filter(a=>a.status==='active').length} active`, icon: Building2, color: 'var(--acc)', dim: 'var(--acc-dim)' },
    { label: 'revenue.collected', val: fmtRs(totalRev), sub: `${CURRENT_MONTH}/${CURRENT_YEAR}`, icon: TrendingUp, color: 'var(--grn)', dim: 'var(--grn-dim)' },
    { label: 'revenue.due', val: fmtRs(totalDue), sub: 'uncollected', icon: DollarSign, color: 'var(--amb)', dim: 'var(--amb-dim)' },
    { label: 'students.active', val: totalStu.toLocaleString(), sub: 'platform-wide', icon: Users, color: 'var(--vio)', dim: 'var(--vio-dim)' },
    { label: 'staff.seats', val: totalStaff, sub: 'admin + teacher rows', icon: Activity, color: 'var(--cyn)', dim: 'var(--cyn-dim)' },
    { label: 'collection_rate', val: `${rate}%`, sub: 'this month', icon: Zap, color: 'var(--grn)', dim: 'var(--grn-dim)' },
  ];

  return (
    <div style={{ padding: '24px 24px 40px' }}>

      {/* ── Page header ── */}
      <div className="anim-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <GitBranch size={11} /> platform / overview
          </div>
          <h1 className="display">Overview</h1>
          <p className="body mono" style={{ marginTop: 6, fontSize: 12 }}>
            select * from academies — {acs.length} rows
          </p>
        </div>
        <Link href="/dashboard/academies">
          <button className="btn btn-primary">
            <Building2 size={13} /> new academy
          </button>
        </Link>
      </div>

      {/* ── KPI Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className={`card card-hover anim-up d${i+1}`}
            style={{ padding: 18, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1, background: `linear-gradient(90deg, transparent, ${k.color}, transparent)`, opacity: 0.45 }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 'var(--r-sm)',
                background: k.dim, border: `1px solid ${k.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <k.icon size={14} color={k.color} strokeWidth={2} />
              </div>
              <ArrowUpRight size={12} color="var(--t3)" />
            </div>

            <div className="stat-num" style={{ color: k.color, marginBottom: 5 }}>{k.val}</div>
            <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{k.label}</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>

        {/* Academy table */}
        <div className="card anim-up d4" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
            <div>
              <div className="title">academies — by revenue</div>
              <div className="body mono" style={{ marginTop: 2, fontSize: 11 }}>order by revenue_month desc</div>
            </div>
            <Link href="/dashboard/academies">
              <button className="btn btn-ghost btn-sm">view all <ChevronRight size={11} /></button>
            </Link>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>academy</th>
                <th>status</th>
                <th>students</th>
                <th>revenue</th>
                <th>due</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...fees].sort((a,b) => b.fee.collected - a.fee.collected).map((x, i) => {
                const [c1] = colorOf(x.a.id);
                return (
                  <tr key={x.a.id}>
                    <td className="mono" style={{ color: 'var(--t3)', fontWeight: 700, fontSize: 11, width: 28 }}>{String(i+1).padStart(2,'0')}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 10.5, background: `${c1}1a`, color: c1, border: `1px solid ${c1}40` }}>
                          {x.a.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: 12.5 }}>{x.a.name}</div>
                          <div className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>{shortId(x.a.id)}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge badge-${x.a.status}`}>{x.a.status}</span></td>
                    <td className="data" style={{ fontWeight: 600, color: 'var(--t1)' }}>{x.stu.active_count}</td>
                    <td className="data" style={{ fontWeight: 700, color: 'var(--grn)' }}>
                      {x.fee.collected > 0 ? fmtRs(x.fee.collected) : <span style={{ color: 'var(--t3)' }}>—</span>}
                    </td>
                    <td className="data" style={{ color: x.fee.due > 0 ? 'var(--amb)' : 'var(--t3)', fontWeight: 600 }}>
                      {x.fee.due > 0 ? fmtRs(x.fee.due) : '—'}
                    </td>
                    <td>
                      <Link href={`/dashboard/academies?enter=${x.a.id}`}>
                        <button className="btn btn-ghost btn-sm" style={{ gap: 5, padding: '4px 9px' }}>
                          <LogIn size={10} /> enter
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Quick actions */}
          <div className="card anim-up d5" style={{ padding: 16 }}>
            <div className="label" style={{ marginBottom: 12 }}>quick_actions</div>
            {[
              { label: 'add_academy()', desc: 'onboard a new tenant', icon: Building2, href: '/dashboard/academies', color: 'var(--acc)' },
              { label: 'view_analytics()', desc: 'revenue & performance', icon: BarChart3, href: '/dashboard/analytics', color: 'var(--vio)' },
              { label: 'staff_overview()', desc: 'admins & teachers', icon: Users, href: '/dashboard/staff', color: 'var(--cyn)' },
            ].map(a => (
              <Link key={a.label} href={a.href}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px', borderRadius: 'var(--r-sm)', cursor: 'pointer',
                  transition: 'background 0.12s', marginBottom: 2
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 'var(--r-sm)', flexShrink: 0,
                    background: `${a.color}14`, border: `1px solid ${a.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <a.icon size={13} color={a.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.2 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{a.desc}</div>
                  </div>
                  <ChevronRight size={12} color="var(--t3)" />
                </div>
              </Link>
            ))}
          </div>

          {/* Alerts */}
          <div className="card anim-up d6" style={{ padding: 16 }}>
            <div className="label" style={{ marginBottom: 12 }}>alerts</div>
            {[
              { msg: 'Roots Academy suspended — overdue license', type: 'red' },
              { msg: '1 academy in trial — needs conversion', type: 'amb' },
              { msg: 'Rs 423K uncollected across 2 inactive academies', type: 'amb' },
            ].map((alert, i) => (
              <div key={i} style={{
                display: 'flex', gap: 9, padding: '9px 10px', borderRadius: 'var(--r-sm)', marginBottom: i < 2 ? 7 : 0,
                background: `var(--${alert.type}-dim)`,
                border: `1px solid rgba(${alert.type==='red' ? '242,73,92' : '232,163,61'},0.18)`,
              }}>
                <AlertTriangle size={12} color={`var(--${alert.type})`} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4 }}>{alert.msg}</span>
              </div>
            ))}
          </div>

          {/* Collection rate bar */}
          <div className="card anim-up d6" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="label">collection_rate</div>
              <div className="data" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: rate > 80 ? 'var(--grn)' : 'var(--amb)' }}>{rate}%</div>
            </div>
            <div className="prog-track" style={{ height: 5, marginBottom: 9 }}>
              <div className="prog-fill" style={{ width: `${rate}%`, background: rate > 80 ? 'linear-gradient(90deg, var(--grn), #5DF0C2)' : 'linear-gradient(90deg, var(--amb), #FFD066)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>collected {fmtRs(totalRev)}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>due {fmtRs(totalDue)}</span>
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
