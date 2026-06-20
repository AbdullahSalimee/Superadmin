"use client";
import { ACADEMIES, PALETTES } from "@/lib/data";
import { TrendingUp, DollarSign, Users, Percent } from "lucide-react";

const fmtRs = (n: number) => `Rs. ${n >= 1_000_000 ? (n/1_000_000).toFixed(2)+'M' : (n/1_000).toFixed(0)+'K'}`;

export default function AnalyticsPage() {
  const acs = ACADEMIES;
  const totalRev = acs.reduce((s,a) => s + a.revenueMonth, 0);
  const totalDue = acs.reduce((s,a) => s + a.dueMonth, 0);
  const rate = Math.round(totalRev / (totalRev + totalDue) * 100);
  const avgPerActive = Math.round(totalRev / acs.filter(a => a.revenueMonth > 0).length);

  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const revData = [2800000, 3100000, 2950000, 3400000, 3720000, 4570087];
  const stuData = [980, 1020, 1055, 1100, 1280, 1327];
  const maxRev = Math.max(...revData);
  const maxStu = Math.max(...stuData);

  const kpis = [
    { label:'Total Collected', val: fmtRs(totalRev), sub:'This month', icon: TrendingUp, color:'var(--grn)', dim:'var(--grn-dim)' },
    { label:'Total Due', val: fmtRs(totalDue), sub:'Uncollected', icon: DollarSign, color:'var(--amb)', dim:'var(--amb-dim)' },
    { label:'Collection Rate', val:`${rate}%`, sub:'Platform-wide efficiency', icon: Percent, color:'var(--blu)', dim:'var(--blu-dim)' },
    { label:'Avg / Academy', val: fmtRs(avgPerActive), sub:'Active academies only', icon: Users, color:'var(--vio)', dim:'var(--vio-dim)' },
  ];

  return (
    <div style={{ padding: '28px 28px 40px' }}>
      <div className="anim-up" style={{ marginBottom: 28 }}>
        <div className="label" style={{ marginBottom: 6 }}>Platform</div>
        <h1 className="display">Analytics</h1>
        <p className="body" style={{ marginTop: 5 }}>Financial and operational performance across all academies</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={k.label} className={`card card-hover anim-up d${i+1}`} style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1, background: `linear-gradient(90deg, transparent, ${k.color}, transparent)`, opacity: 0.35 }} />
            <div style={{ width: 32, height: 32, borderRadius: 9, background: k.dim, border: `1px solid ${k.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <k.icon size={15} color={k.color} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: k.color, marginBottom: 4 }}>{k.val}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Revenue trend bar chart */}
        <div className="card anim-up d3" style={{ padding: 22 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="title" style={{ marginBottom: 3 }}>Revenue Trend</div>
            <p className="body" style={{ fontSize: 12 }}>Monthly platform-wide fee collections (Jan–Jun)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, paddingBottom: 24, position: 'relative' }}>
            {/* Gridlines */}
            {[0,25,50,75,100].map(p => (
              <div key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: `calc(24px + ${p/100 * 136}px)`, borderTop: `1px dashed ${p === 0 ? 'var(--line-md)' : 'var(--line)'}`, zIndex: 0 }}>
                {p > 0 && <span style={{ position: 'absolute', left: 0, top: -9, fontSize: 9, color: 'var(--t3)', fontWeight: 600 }}>
                  {Math.round(maxRev * p / 100 / 1_000_000 * 10) / 10}M
                </span>}
              </div>
            ))}
            {revData.map((v, i) => {
              const h = Math.round((v / maxRev) * 136);
              const isLast = i === revData.length - 1;
              const growth = i > 0 ? Math.round((v - revData[i-1]) / revData[i-1] * 100) : null;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1 }}>
                  {growth !== null && isLast && (
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--grn)', marginBottom: 2 }}>+{growth}%</div>
                  )}
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0', height: h,
                    background: isLast ? 'linear-gradient(180deg, #478BFF, #2B5CE6)' : 'var(--raised)',
                    border: `1px solid ${isLast ? 'var(--line-blu)' : 'var(--line)'}`,
                    transition: 'all 0.3s',
                    boxShadow: isLast ? '0 0 20px rgba(71,139,255,0.2)' : 'none',
                  }} />
                  <div style={{ fontSize: 10, fontWeight: 600, color: isLast ? 'var(--blu)' : 'var(--t3)', marginTop: 2 }}>{months[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student growth */}
        <div className="card anim-up d4" style={{ padding: 22 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="title" style={{ marginBottom: 3 }}>Student Growth</div>
            <p className="body" style={{ fontSize: 12 }}>Platform-wide active students over time</p>
          </div>
          {/* Line chart via SVG */}
          <svg viewBox="0 0 260 140" width="100%" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="stuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D37E" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22D37E" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(p => (
              <line key={p} x1="20" y1={10 + (1-p/100)*110} x2="250" y2={10 + (1-p/100)*110} stroke="var(--line)" strokeWidth="0.5" strokeDasharray="3,3" />
            ))}
            {/* Area fill */}
            <path
              d={`M ${stuData.map((v,i) => `${20 + i*46},${10 + (1 - (v-stuData[0])/(maxStu-stuData[0]+50))*110}`).join(' L ')} L ${20 + (stuData.length-1)*46},120 L 20,120 Z`}
              fill="url(#stuGrad)"
            />
            {/* Line */}
            <polyline
              points={stuData.map((v,i) => `${20 + i*46},${10 + (1 - (v-stuData[0])/(maxStu-stuData[0]+50))*110}`).join(' ')}
              fill="none" stroke="var(--grn)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Dots */}
            {stuData.map((v,i) => (
              <circle key={i} cx={20 + i*46} cy={10 + (1 - (v-stuData[0])/(maxStu-stuData[0]+50))*110}
                r={i === stuData.length-1 ? 4 : 3}
                fill={i === stuData.length-1 ? 'var(--grn)' : 'var(--card)'}
                stroke="var(--grn)" strokeWidth="2"
              />
            ))}
            {/* Month labels */}
            {months.map((m,i) => (
              <text key={m} x={20 + i*46} y={135} textAnchor="middle" fontSize="9" fill="var(--t3)" fontWeight="600">{m}</text>
            ))}
            {/* Value label on last point */}
            <text x={20+(stuData.length-1)*46} y={10 + (1-(stuData[stuData.length-1]-stuData[0])/(maxStu-stuData[0]+50))*110 - 10}
              textAnchor="middle" fontSize="10" fill="var(--grn)" fontWeight="800">{stuData[stuData.length-1]}</text>
          </svg>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Revenue by academy */}
        <div className="card anim-up d5" style={{ padding: 22 }}>
          <div className="title" style={{ marginBottom: 4 }}>Revenue by Academy</div>
          <p className="body" style={{ fontSize: 12, marginBottom: 18 }}>This month</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {[...acs].filter(a => a.revenueMonth > 0).sort((a,b) => b.revenueMonth - a.revenueMonth).map((ac, i) => {
              const [c1] = PALETTES[ac.colorIdx % PALETTES.length];
              const pct = Math.round(ac.revenueMonth / totalRev * 100);
              return (
                <div key={ac.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: c1, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{ac.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>{pct}%</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--grn)', fontVariantNumeric: 'tabular-nums' }}>{fmtRs(ac.revenueMonth)}</span>
                    </div>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${pct}%`, background: c1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status donut + breakdown */}
        <div className="card anim-up d6" style={{ padding: 22 }}>
          <div className="title" style={{ marginBottom: 4 }}>Academy Status Breakdown</div>
          <p className="body" style={{ fontSize: 12, marginBottom: 20 }}>Platform health at a glance</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {(['active','trial','suspended'] as const).map(s => {
              const count = acs.filter(a => a.status === s).length;
              const pct = Math.round(count / acs.length * 100);
              const colors: Record<string,string> = { active: 'var(--grn)', trial: 'var(--amb)', suspended: 'var(--red)' };
              const dims: Record<string,string> = { active: 'var(--grn-dim)', trial: 'var(--amb-dim)', suspended: 'var(--red-dim)' };
              return (
                <div key={s} style={{ background: dims[s], borderRadius: 10, padding: '14px 12px', textAlign: 'center', border: `1px solid ${colors[s]}22` }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: colors[s], letterSpacing: '-0.04em' }}>{count}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors[s], marginTop: 3, opacity: 0.8 }}>{s}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>{pct}% of total</div>
                </div>
              );
            })}
          </div>

          {/* Student distribution */}
          <div className="label" style={{ marginBottom: 10 }}>Student Distribution</div>
          {[...acs].sort((a,b) => b.students - a.students).map(ac => {
            const [c1] = PALETTES[ac.colorIdx % PALETTES.length];
            const pct = Math.round(ac.students / Math.max(...acs.map(a=>a.students)) * 100);
            return (
              <div key={ac.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 88, fontSize: 11, color: 'var(--t2)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{ac.name}</div>
                <div className="prog-track" style={{ flex: 1 }}>
                  <div className="prog-fill" style={{ width: `${pct}%`, background: c1 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', width: 28, textAlign: 'right', flexShrink: 0 }}>{ac.students}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
