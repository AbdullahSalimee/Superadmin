"use client";
import { ACADEMIES, feesOf, studentsOf, colorOf } from "@/lib/data";
import { TrendingUp, DollarSign, Users, Percent } from "lucide-react";

const fmtRs = (n: number) => `Rs ${n >= 1_000_000 ? (n/1_000_000).toFixed(2)+'M' : (n/1_000).toFixed(0)+'K'}`;

export default function AnalyticsPage() {
  const acs = ACADEMIES;
  const fees = acs.map(a => ({ a, fee: feesOf(a.id), stu: studentsOf(a.id) }));
  const totalRev = fees.reduce((s, x) => s + x.fee.collected, 0);
  const totalDue = fees.reduce((s, x) => s + x.fee.due, 0);
  const rate = Math.round(totalRev / (totalRev + totalDue) * 100);
  const activeWithRev = fees.filter(x => x.fee.collected > 0).length;
  const avgPerActive = Math.round(totalRev / Math.max(activeWithRev, 1));

  const months = ['jan','feb','mar','apr','may','jun'];
  const revData = [2800000, 3100000, 2950000, 3400000, 3720000, 4570087];
  const stuData = [980, 1020, 1055, 1100, 1280, 1327];
  const maxRev = Math.max(...revData);

  const kpis = [
    { label:'collected.total', val: fmtRs(totalRev), sub:'this month', icon: TrendingUp, color:'var(--grn)', dim:'var(--grn-dim)' },
    { label:'due.total', val: fmtRs(totalDue), sub:'uncollected', icon: DollarSign, color:'var(--amb)', dim:'var(--amb-dim)' },
    { label:'collection_rate', val:`${rate}%`, sub:'platform-wide', icon: Percent, color:'var(--acc)', dim:'var(--acc-dim)' },
    { label:'avg_per_academy', val: fmtRs(avgPerActive), sub:'active only', icon: Users, color:'var(--vio)', dim:'var(--vio-dim)' },
  ];

  return (
    <div style={{ padding: '24px 24px 40px' }}>
      <div className="anim-up" style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 6 }}>platform / analytics</div>
        <h1 className="display">Analytics</h1>
        <p className="body mono" style={{ marginTop: 5, fontSize: 12 }}>financial and operational performance — aggregated from fee_records</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <div key={k.label} className={`card card-hover anim-up d${i+1}`} style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 14, right: 14, height: 1, background: `linear-gradient(90deg, transparent, ${k.color}, transparent)`, opacity: 0.4 }} />
            <div style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: k.dim, border: `1px solid ${k.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 13 }}>
              <k.icon size={14} color={k.color} />
            </div>
            <div className="data" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.04em', color: k.color, marginBottom: 4 }}>{k.val}</div>
            <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{k.label}</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Revenue trend bar chart */}
        <div className="card anim-up d3" style={{ padding: 20 }}>
          <div style={{ marginBottom: 18 }}>
            <div className="title" style={{ marginBottom: 3 }}>revenue_trend</div>
            <p className="body mono" style={{ fontSize: 11 }}>monthly platform-wide fee collections, jan–jun</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150, paddingBottom: 22, position: 'relative' }}>
            {[0,25,50,75,100].map(p => (
              <div key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: `calc(22px + ${p/100 * 128}px)`, borderTop: `1px dashed ${p === 0 ? 'var(--line-md)' : 'var(--line)'}`, zIndex: 0 }}>
                {p > 0 && <span className="mono" style={{ position: 'absolute', left: 0, top: -9, fontSize: 9, color: 'var(--t3)', fontWeight: 600 }}>
                  {Math.round(maxRev * p / 100 / 1_000_000 * 10) / 10}M
                </span>}
              </div>
            ))}
            {revData.map((v, i) => {
              const h = Math.round((v / maxRev) * 128);
              const isLast = i === revData.length - 1;
              const growth = i > 0 ? Math.round((v - revData[i-1]) / revData[i-1] * 100) : null;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1 }}>
                  {growth !== null && isLast && (
                    <div className="mono" style={{ fontSize: 9, fontWeight: 700, color: 'var(--grn)', marginBottom: 2 }}>+{growth}%</div>
                  )}
                  <div style={{
                    width: '100%', borderRadius: '2px 2px 0 0', height: h,
                    background: isLast ? 'linear-gradient(180deg, #00E599, #00A36C)' : 'var(--raised)',
                    border: `1px solid ${isLast ? 'var(--line-acc)' : 'var(--line)'}`,
                    transition: 'all 0.3s',
                    boxShadow: isLast ? '0 0 16px rgba(0,229,153,0.25)' : 'none',
                  }} />
                  <div className="mono" style={{ fontSize: 10, fontWeight: 600, color: isLast ? 'var(--acc)' : 'var(--t3)', marginTop: 2 }}>{months[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student growth */}
        <div className="card anim-up d4" style={{ padding: 20 }}>
          <div style={{ marginBottom: 18 }}>
            <div className="title" style={{ marginBottom: 3 }}>student_growth</div>
            <p className="body mono" style={{ fontSize: 11 }}>platform-wide active students over time</p>
          </div>
          <svg viewBox="0 0 260 140" width="100%" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="stuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E599" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#00E599" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map(p => (
              <line key={p} x1="20" y1={10 + (1-p/100)*110} x2="250" y2={10 + (1-p/100)*110} stroke="var(--line)" strokeWidth="0.5" strokeDasharray="3,3" />
            ))}
            <path
              d={`M ${stuData.map((v,i) => `${20 + i*46},${10 + (1 - (v-stuData[0])/(Math.max(...stuData)-stuData[0]+50))*110}`).join(' L ')} L ${20 + (stuData.length-1)*46},120 L 20,120 Z`}
              fill="url(#stuGrad)"
            />
            <polyline
              points={stuData.map((v,i) => `${20 + i*46},${10 + (1 - (v-stuData[0])/(Math.max(...stuData)-stuData[0]+50))*110}`).join(' ')}
              fill="none" stroke="#00E599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
            {stuData.map((v,i) => (
              <circle key={i} cx={20 + i*46} cy={10 + (1 - (v-stuData[0])/(Math.max(...stuData)-stuData[0]+50))*110}
                r={i === stuData.length-1 ? 4 : 2.5}
                fill={i === stuData.length-1 ? '#00E599' : 'var(--card)'}
                stroke="#00E599" strokeWidth="2"
              />
            ))}
            {months.map((m,i) => (
              <text key={m} x={20 + i*46} y={135} textAnchor="middle" fontSize="9" fill="var(--t3)" fontWeight="600" fontFamily="var(--font-mono)">{m}</text>
            ))}
            <text x={20+(stuData.length-1)*46} y={10 + (1-(stuData[stuData.length-1]-stuData[0])/(Math.max(...stuData)-stuData[0]+50))*110 - 10}
              textAnchor="middle" fontSize="10" fill="#00E599" fontWeight="800" fontFamily="var(--font-mono)">{stuData[stuData.length-1]}</text>
          </svg>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Revenue by academy */}
        <div className="card anim-up d5" style={{ padding: 20 }}>
          <div className="title" style={{ marginBottom: 4 }}>revenue_by_academy</div>
          <p className="body mono" style={{ fontSize: 11, marginBottom: 16 }}>this month</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...fees].filter(x => x.fee.collected > 0).sort((a,b) => b.fee.collected - a.fee.collected).map((x) => {
              const [c1] = colorOf(x.a.id);
              const pct = Math.round(x.fee.collected / totalRev * 100);
              return (
                <div key={x.a.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 1, background: c1, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{x.a.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>{pct}%</span>
                      <span className="data" style={{ fontSize: 12, fontWeight: 700, color: 'var(--grn)' }}>{fmtRs(x.fee.collected)}</span>
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
        <div className="card anim-up d6" style={{ padding: 20 }}>
          <div className="title" style={{ marginBottom: 4 }}>status_breakdown</div>
          <p className="body mono" style={{ fontSize: 11, marginBottom: 18 }}>group by status</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
            {(['active','trial','suspended'] as const).map(s => {
              const count = acs.filter(a => a.status === s).length;
              const pct = Math.round(count / acs.length * 100);
              const colors: Record<string,string> = { active: 'var(--grn)', trial: 'var(--amb)', suspended: 'var(--red)' };
              const dims: Record<string,string> = { active: 'var(--grn-dim)', trial: 'var(--amb-dim)', suspended: 'var(--red-dim)' };
              return (
                <div key={s} style={{ background: dims[s], borderRadius: 'var(--r-md)', padding: '13px 10px', textAlign: 'center', border: `1px solid ${colors[s]}33` }}>
                  <div className="data" style={{ fontSize: 22, fontWeight: 700, color: colors[s], letterSpacing: '-0.04em' }}>{count}</div>
                  <div className="mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.05em', color: colors[s], marginTop: 3, opacity: 0.85 }}>{s}</div>
                  <div className="mono" style={{ fontSize: 9.5, color: 'var(--t3)', marginTop: 4 }}>{pct}%</div>
                </div>
              );
            })}
          </div>

          {/* Student distribution */}
          <div className="label" style={{ marginBottom: 10 }}>student_distribution</div>
          {[...fees].sort((a,b) => b.stu.active_count - a.stu.active_count).map(x => {
            const [c1] = colorOf(x.a.id);
            const maxStu = Math.max(...fees.map(f => f.stu.active_count));
            const pct = Math.round(x.stu.active_count / maxStu * 100);
            return (
              <div key={x.a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div className="mono" style={{ width: 88, fontSize: 10.5, color: 'var(--t2)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{x.a.name}</div>
                <div className="prog-track" style={{ flex: 1 }}>
                  <div className="prog-fill" style={{ width: `${pct}%`, background: c1 }} />
                </div>
                <div className="data" style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', width: 28, textAlign: 'right', flexShrink: 0 }}>{x.stu.active_count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
