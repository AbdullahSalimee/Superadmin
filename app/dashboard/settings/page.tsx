"use client";
import { useState } from "react";
import { ShieldCheck, Bell, Database, SlidersHorizontal, Save, Check, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [toast, setToast] = useState("");
  const [showPw, setShowPw] = useState(false);
  const save = (label: string) => { setToast(`${label} saved`); setTimeout(() => setToast(""), 2200); };

  const sections = [
    { icon: ShieldCheck, title: 'Super Admin Credentials', desc: 'Change the platform master password', color: 'var(--blu)' },
    { icon: Bell, title: 'Notifications', desc: 'Platform-level alert preferences', color: 'var(--vio)' },
    { icon: Database, title: 'Data Retention', desc: 'Soft-delete cleanup policy', color: 'var(--amb)' },
    { icon: SlidersHorizontal, title: 'Platform Defaults', desc: 'Defaults applied to new academies', color: 'var(--grn)' },
  ];

  return (
    <div style={{ padding: '28px 28px 40px' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24, zIndex: 200,
          background: 'var(--card)', border: '1px solid var(--line-md)', borderRadius: 10,
          padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)', animation: 'slideUp 0.2s ease',
          fontSize: 13, fontWeight: 600, color: 'var(--t1)',
        }}>
          <Check size={14} color="var(--grn)" /> {toast}
        </div>
      )}

      <div className="anim-up" style={{ marginBottom: 28 }}>
        <div className="label" style={{ marginBottom: 6 }}>Platform</div>
        <h1 className="display">Settings</h1>
        <p className="body" style={{ marginTop: 5 }}>Platform-level configuration and preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
        {sections.map((s, i) => (
          <div key={s.title} className={`card anim-up d${i+1}`} style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}14`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={17} color={s.color} />
              </div>
              <div>
                <div className="title">{s.title}</div>
                <div className="body" style={{ fontSize: 12, marginTop: 1 }}>{s.desc}</div>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--line)', marginBottom: 16 }} />

            {s.title === 'Super Admin Credentials' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" type={showPw ? 'text' : 'password'} placeholder="Enter new master password" style={{ paddingRight: 38 }} />
                    <button onClick={() => setShowPw(v=>!v)} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex' }}>
                      {showPw ? <EyeOff size={13}/> : <Eye size={13}/>}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('Password')}><Save size={12} /> Update Password</button>
                </div>
              </div>
            )}

            {s.title === 'Notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Alert Email</label>
                  <input className="input" placeholder="admin@platform.io" />
                </div>
                {['New academy signups', 'Overdue fee alerts', 'Suspended academy reminders'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--t2)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--blu)', width: 14, height: 14 }} />
                    {opt}
                  </label>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('Notification settings')}><Save size={12} /> Save</button>
                </div>
              </div>
            )}

            {s.title === 'Data Retention' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Soft-Delete Retention (days)</label>
                  <input className="input" type="number" defaultValue={90} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('Retention policy')}><Save size={12} /> Save</button>
                </div>
              </div>
            )}

            {s.title === 'Platform Defaults' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Default Status for New Academies</label>
                  <select className="input" defaultValue="active">
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Trial Period Length (days)</label>
                  <input className="input" type="number" defaultValue={30} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => save('Platform defaults')}><Save size={12} /> Save</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
