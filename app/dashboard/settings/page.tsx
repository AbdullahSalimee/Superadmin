"use client";
import { useState } from "react";
import { ShieldCheck, Bell, Database, SlidersHorizontal, Save, Check, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [toast, setToast] = useState("");
  const [showPw, setShowPw] = useState(false);
  const save = (label: string) => { setToast(`${label} saved`); setTimeout(() => setToast(""), 2200); };

  const sections = [
    { icon: ShieldCheck, title: 'super_admin_credentials', desc: 'change the platform master password', color: 'var(--acc)' },
    { icon: Bell, title: 'notifications', desc: 'platform-level alert preferences', color: 'var(--vio)' },
    { icon: Database, title: 'data_retention', desc: 'soft-delete cleanup policy', color: 'var(--amb)' },
    { icon: SlidersHorizontal, title: 'platform_defaults', desc: 'defaults applied to new academies', color: 'var(--cyn)' },
  ];

  return (
    <div style={{ padding: '24px 24px 40px' }}>
      {toast && (
        <div className="mono" style={{
          position: 'fixed', top: 18, right: 22, zIndex: 200,
          background: 'var(--card)', border: '1px solid var(--line-md)', borderRadius: 'var(--r-md)',
          padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)', animation: 'slideUp 0.18s ease',
          fontSize: 12, fontWeight: 600, color: 'var(--t1)',
        }}>
          <Check size={13} color="var(--acc)" /> {toast}
        </div>
      )}

      <div className="anim-up" style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 6 }}>platform / settings</div>
        <h1 className="display">Settings</h1>
        <p className="body mono" style={{ marginTop: 5, fontSize: 12 }}>platform-level configuration and preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 620 }}>
        {sections.map((s, i) => (
          <div key={s.title} className={`card anim-up d${i+1}`} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', background: `${s.color}14`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={15} color={s.color} />
              </div>
              <div>
                <div className="title">{s.title}</div>
                <div className="body" style={{ fontSize: 11.5, marginTop: 1 }}>{s.desc}</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--line)', marginBottom: 15 }} />

            {s.title === 'super_admin_credentials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>new_password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" type={showPw ? 'text' : 'password'} placeholder="enter new master password" style={{ paddingRight: 36 }} />
                    <button onClick={() => setShowPw(v=>!v)} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex' }}>
                      {showPw ? <EyeOff size={12}/> : <Eye size={12}/>}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('password')}><Save size={11} /> update password</button>
                </div>
              </div>
            )}

            {s.title === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>alert_email</label>
                  <input className="input" placeholder="admin@platform.io" />
                </div>
                {['new academy signups', 'overdue fee alerts', 'suspended academy reminders'].map(opt => (
                  <label key={opt} className="mono" style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: 'var(--t2)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--acc)', width: 14, height: 14 }} />
                    {opt}
                  </label>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('notification settings')}><Save size={11} /> save</button>
                </div>
              </div>
            )}

            {s.title === 'data_retention' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>soft_delete_retention_days</label>
                  <input className="input" type="number" defaultValue={90} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('retention policy')}><Save size={11} /> save</button>
                </div>
              </div>
            )}

            {s.title === 'platform_defaults' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>default_status_new_academies</label>
                  <select className="input" defaultValue="active">
                    <option value="active">active</option>
                    <option value="trial">trial</option>
                  </select>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>trial_period_days</label>
                  <input className="input" type="number" defaultValue={30} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('platform defaults')}><Save size={11} /> save</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
