"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Plus, MoreVertical, Pencil, Trash2, LogIn, X,
  Eye, EyeOff, ChevronLeft, Check, AlertTriangle, KeyRound,
  Building2, Users, DollarSign, MapPin, Calendar, ExternalLink, ShieldAlert
} from "lucide-react";
import { ACADEMIES, Academy, Status, PALETTES, SA_PASSWORD } from "@/lib/data";

const fmtRs = (n: number) => n >= 1_000_000 ? `Rs. ${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `Rs. ${(n/1_000).toFixed(0)}K` : `Rs. ${n}`;

type Modal = 'create' | 'edit' | 'delete' | 'admins' | null;

function AcademiesContent() {
  const sp = useSearchParams();
  const [acs, setAcs] = useState<Academy[]>(ACADEMIES);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<Modal>(null);
  const [sel, setSel] = useState<Academy | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [imp, setImp] = useState<Academy | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [showPw, setShowPw] = useState({ admin: false, teacher: false });
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: '', city: '', status: 'active' as Status,
    adminPw: '', teacherPw: '', contactName: '', contactPhone: '',
  });

  useEffect(() => {
    const id = sp.get('enter');
    if (id) { const a = acs.find(x => x.id === id); if (a) setImp(a); }
  }, [sp]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const visble = acs.filter(a => {
    const ms = a.name.toLowerCase().includes(q.toLowerCase()) || a.city.toLowerCase().includes(q.toLowerCase());
    const mf = filter === 'All' || a.status === filter.toLowerCase();
    return ms && mf;
  });

  const openCreate = () => {
    setForm({ name:'', city:'', status:'active', adminPw:'', teacherPw:'', contactName:'', contactPhone:'' });
    setModal('create');
  };
  const openEdit = (a: Academy) => {
    setSel(a);
    setForm({ name:a.name, city:a.city, status:a.status, adminPw:'', teacherPw:'', contactName:a.contactName, contactPhone:a.contactPhone });
    setModal('edit'); setMenu(null);
  };
  const openDelete = (a: Academy) => { setSel(a); setConfirmName(''); setModal('delete'); setMenu(null); };
  const openAdmins = (a: Academy) => { setSel(a); setModal('admins'); setMenu(null); };

  const doCreate = () => {
    if (!form.name || !form.adminPw || !form.teacherPw) return;
    const n: Academy = {
      id: Date.now().toString(), name: form.name, city: form.city || '—',
      status: form.status, students: 0, admins: 1, teachers: 0,
      revenueMonth: 0, dueMonth: 0,
      createdAt: new Date().toISOString().split('T')[0],
      contactName: form.contactName, contactPhone: form.contactPhone,
      colorIdx: acs.length % 6,
    };
    setAcs(p => [n, ...p]); setModal(null); showToast(`Academy "${n.name}" created`);
  };
  const doEdit = () => {
    if (!sel || !form.name) return;
    setAcs(p => p.map(a => a.id === sel.id ? { ...a, name: form.name, city: form.city, status: form.status, contactName: form.contactName, contactPhone: form.contactPhone } : a));
    setModal(null); showToast("Changes saved");
  };
  const doDelete = () => {
    if (!sel || confirmName !== sel.name) return;
    setAcs(p => p.filter(a => a.id !== sel.id)); setModal(null); showToast(`"${sel.name}" deleted`);
  };

  /* ── Impersonation View ── */
  if (imp) return (
    <div style={{ minHeight: '100vh', background: 'var(--base)' }}>
      <div className="imp-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'rgba(159,122,234,0.14)', color: 'var(--vio)',
            border: '1px solid rgba(159,122,234,0.25)',
          }}>Super Admin Mode</div>
          <span style={{ fontSize: 13, color: 'var(--t2)' }}>
            Operating inside <strong style={{ color: 'var(--t1)', fontWeight: 700 }}>{imp.name}</strong> with full Admin rights
          </span>
          <span className="badge badge-active" style={{ fontSize: 10 }}>{imp.status}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setImp(null)}>
          <ChevronLeft size={13} /> Exit to Dashboard
        </button>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 28 }}>
          <div className="label" style={{ marginBottom: 6 }}>Impersonating Academy</div>
          <h2 className="heading">{imp.name} — Admin View</h2>
          <p className="body" style={{ marginTop: 4 }}>All actions taken here are scoped to academy_id: <span style={{ fontFamily: 'monospace', color: 'var(--blu)', fontSize: 11 }}>{imp.id}</span></p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Students', val: imp.students, color: 'var(--blu)' },
            { label: 'Admins', val: imp.admins, color: 'var(--vio)' },
            { label: 'Teachers', val: imp.teachers, color: 'var(--cyn)' },
            { label: 'Revenue', val: fmtRs(imp.revenueMonth), color: 'var(--grn)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: s.color, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs preview */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid var(--line)', padding: '0 20px', display: 'flex', gap: 2 }}>
            {['Students','Attendance','Fees','Fee Record','Tests','Results','Classes & Subjects'].map((t, i) => (
              <div key={t} style={{
                padding: '14px 14px 13px',
                fontSize: 13, fontWeight: i === 0 ? 700 : 500,
                color: i === 0 ? 'var(--blu)' : 'var(--t3)',
                borderBottom: i === 0 ? '2px solid var(--blu)' : '2px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.12s'
              }}>{t}</div>
            ))}
          </div>
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: 'var(--blu-dim)',
              border: '1px solid var(--line-blu)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 14px'
            }}>
              <ExternalLink size={20} color="var(--blu)" />
            </div>
            <div className="title" style={{ marginBottom: 8 }}>Full AMS Interface Loads Here</div>
            <p className="body" style={{ maxWidth: 440, margin: '0 auto 20px', fontSize: 12 }}>
              In production, the complete Academy Management System (Students, Attendance, Fees, Tests, Results)
              is rendered here with full Admin rights, automatically scoped to this academy's data.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px',
              borderRadius: 8, background: 'var(--vio-dim)', border: '1px solid rgba(159,122,234,0.2)',
              fontSize: 11, fontWeight: 700, color: 'var(--vio)', letterSpacing: '0.04em', textTransform: 'uppercase'
            }}>
              <ShieldAlert size={12} /> Super Admin session · academy_id: {imp.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Main Academies Page ── */
  return (
    <div style={{ padding: '28px 28px 40px' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24, zIndex: 200,
          background: 'var(--card)', border: '1px solid var(--line-md)',
          borderRadius: 10, padding: '11px 16px',
          display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.2s cubic-bezier(0.16,1,0.3,1)',
          fontSize: 13, fontWeight: 600, color: 'var(--t1)',
        }}>
          <Check size={14} color="var(--grn)" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="anim-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Platform</div>
          <h1 className="display">All Academies</h1>
          <p className="body" style={{ marginTop: 5 }}>{acs.length} tenants · {acs.filter(a=>a.status==='active').length} active</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={14} strokeWidth={2.5} /> Add Academy
        </button>
      </div>

      {/* Filters */}
      <div className="anim-up" style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={13} color="var(--t3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input className="input" placeholder="Search by name or city…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All','Active','Trial','Suspended'].map(s => (
            <button key={s} className={`chip${filter===s?' on':''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>{visble.length} shown</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {visble.map((ac, i) => {
          const [c1, c2] = PALETTES[ac.colorIdx % PALETTES.length];
          return (
            <div
              key={ac.id}
              className={`card card-hover anim-up d${Math.min(i+1,6)}`}
              style={{ padding: 22, position: 'relative', overflow: 'hidden' }}
            >
              {/* Subtle gradient top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c1}, ${c2})`, opacity: 0.7 }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div className="avatar" style={{
                    width: 42, height: 42, borderRadius: 12, fontSize: 16, fontWeight: 800,
                    background: `linear-gradient(135deg, ${c1}22, ${c2}33)`,
                    color: c1, border: `1px solid ${c1}33`,
                  }}>{ac.name.charAt(0)}</div>
                  <div>
                    <div className="title" style={{ marginBottom: 4 }}>{ac.name}</div>
                    <span className={`badge badge-${ac.status}`}>{ac.status}</span>
                  </div>
                </div>

                {/* Kebab */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn-icon"
                    onClick={e => { e.stopPropagation(); setMenu(menu === ac.id ? null : ac.id); }}
                  >
                    <MoreVertical size={14} color="var(--t3)" />
                  </button>
                  {menu === ac.id && (
                    <div className="menu-drop">
                      <button className="menu-item" onClick={() => openEdit(ac)}>
                        <Pencil size={13} /> Edit Academy
                      </button>
                      <button className="menu-item" onClick={() => openAdmins(ac)}>
                        <KeyRound size={13} /> Manage Credentials
                      </button>
                      <button className="menu-item" onClick={() => { setImp(ac); setMenu(null); }}>
                        <LogIn size={13} /> Enter Academy
                      </button>
                      <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                      <button className="menu-item danger" onClick={() => openDelete(ac)}>
                        <Trash2 size={13} /> Delete Academy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--t3)' }}>
                  <MapPin size={11} /> {ac.city}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--t3)' }}>
                  <Calendar size={11} /> {new Date(ac.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                background: 'var(--raised)', borderRadius: 10, overflow: 'hidden',
                border: '1px solid var(--line)', marginBottom: 16,
              }}>
                {[
                  { icon: Users, val: ac.students, label: 'Students' },
                  { icon: Users, val: ac.admins + ac.teachers, label: 'Staff' },
                  { icon: DollarSign, val: ac.revenueMonth > 0 ? `${(ac.revenueMonth/1000).toFixed(0)}K` : '—', label: 'Revenue' },
                ].map((s, si) => (
                  <div key={s.label} style={{
                    padding: '12px 10px', textAlign: 'center',
                    borderRight: si < 2 ? '1px solid var(--line)' : 'none'
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 2 }}>{s.val}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Revenue bar */}
              {ac.revenueMonth > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Collection</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--grn)' }}>
                      {Math.round(ac.revenueMonth / (ac.revenueMonth + ac.dueMonth) * 100)}%
                    </span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{
                      width: `${Math.round(ac.revenueMonth / (ac.revenueMonth + ac.dueMonth) * 100)}%`,
                      background: `linear-gradient(90deg, ${c1}, ${c2})`,
                    }} />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ac)} style={{ flex: 1 }}>
                  <Pencil size={11} /> Edit
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setImp(ac)}
                  style={{ flex: 2 }}
                >
                  <LogIn size={11} /> Enter Academy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visble.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Building2 size={36} color="var(--t3)" style={{ margin: '0 auto 12px' }} />
          <div className="title" style={{ marginBottom: 6 }}>No academies found</div>
          <p className="body" style={{ fontSize: 12 }}>Adjust your search or filters</p>
        </div>
      )}

      {/* Click-outside closes menu */}
      {menu && <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenu(null)} />}

      {/* ══ MODALS ══════════════════════════════════════════════ */}
      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            {/* ── Create / Edit ── */}
            {(modal === 'create' || modal === 'edit') && (
              <>
                <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <h2 className="title" style={{ fontSize: 16, marginBottom: 3 }}>
                        {modal === 'create' ? 'Create New Academy' : `Edit "${sel?.name}"`}
                      </h2>
                      <p className="body" style={{ fontSize: 12 }}>
                        {modal === 'create' ? 'Onboard a new tenant to the platform' : 'Update academy details and configuration'}
                      </p>
                    </div>
                    <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
                  </div>
                </div>
                <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>Academy Name *</label>
                      <input className="input" placeholder="e.g. Superior Academy" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} autoFocus />
                    </div>
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>City</label>
                      <input className="input" placeholder="e.g. Lahore" value={form.city} onChange={e => setForm(p=>({...p,city:e.target.value}))} />
                    </div>
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>Status *</label>
                      <select className="input" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value as Status}))}>
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    {modal === 'create' && (
                      <>
                        <div>
                          <label className="label" style={{ display: 'block', marginBottom: 6 }}>Admin Password *</label>
                          <div style={{ position: 'relative' }}>
                            <input className="input" type={showPw.admin ? 'text' : 'password'} placeholder="Set admin password" value={form.adminPw} onChange={e => setForm(p=>({...p,adminPw:e.target.value}))} style={{ paddingRight: 38 }} />
                            <button onClick={() => setShowPw(p=>({...p,admin:!p.admin}))} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex' }}>
                              {showPw.admin ? <EyeOff size={13}/> : <Eye size={13}/>}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="label" style={{ display: 'block', marginBottom: 6 }}>Teacher Password *</label>
                          <div style={{ position: 'relative' }}>
                            <input className="input" type={showPw.teacher ? 'text' : 'password'} placeholder="Set teacher password" value={form.teacherPw} onChange={e => setForm(p=>({...p,teacherPw:e.target.value}))} style={{ paddingRight: 38 }} />
                            <button onClick={() => setShowPw(p=>({...p,teacher:!p.teacher}))} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex' }}>
                              {showPw.teacher ? <EyeOff size={13}/> : <Eye size={13}/>}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>Contact Name</label>
                      <input className="input" placeholder="Academy director" value={form.contactName} onChange={e => setForm(p=>({...p,contactName:e.target.value}))} />
                    </div>
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>Contact Phone</label>
                      <input className="input" placeholder="03XX-XXXXXXX" value={form.contactPhone} onChange={e => setForm(p=>({...p,contactPhone:e.target.value}))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                    <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ flex: 1 }}>Cancel</button>
                    <button className="btn btn-primary" onClick={modal === 'create' ? doCreate : doEdit} style={{ flex: 1 }}>
                      <Check size={13} /> {modal === 'create' ? 'Create Academy' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Delete ── */}
            {modal === 'delete' && sel && (
              <>
                <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <h2 className="title" style={{ fontSize: 16, color: 'var(--red)', marginBottom: 3 }}>Delete Academy</h2>
                    <p className="body" style={{ fontSize: 12 }}>This action cannot be undone from the UI</p>
                  </div>
                  <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <div style={{ padding: '13px 14px', borderRadius: 10, marginBottom: 18, background: 'var(--red-dim)', border: '1px solid rgba(255,91,91,0.18)' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <AlertTriangle size={14} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
                        Soft-deleting <strong style={{ color: 'var(--t1)' }}>{sel.name}</strong> will hide it from all views and exclude it from platform totals. All data ({sel.students} students, all fees, attendance, tests) is preserved in the database.
                      </p>
                    </div>
                  </div>
                  <label className="label" style={{ display: 'block', marginBottom: 7 }}>
                    Type &ldquo;<span style={{ color: 'var(--t1)', fontFamily: 'monospace', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>{sel.name}</span>&rdquo; to confirm
                  </label>
                  <input
                    className="input"
                    placeholder="Academy name…"
                    value={confirmName}
                    onChange={e => setConfirmName(e.target.value)}
                    style={{ marginBottom: 16, borderColor: confirmName === sel.name ? 'var(--red)' : undefined }}
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ flex: 1 }}>Cancel</button>
                    <button
                      className="btn btn-danger"
                      onClick={doDelete}
                      disabled={confirmName !== sel.name}
                      style={{ flex: 1, opacity: confirmName === sel.name ? 1 : 0.4, cursor: confirmName === sel.name ? 'pointer' : 'not-allowed' }}
                    >
                      <Trash2 size={13} /> Delete Academy
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Manage Credentials ── */}
            {modal === 'admins' && sel && (
              <>
                <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <h2 className="title" style={{ fontSize: 16, marginBottom: 3 }}>Manage Credentials</h2>
                    <p className="body" style={{ fontSize: 12 }}>{sel.name} · Shared role passwords</p>
                  </div>
                  <button className="btn-icon" onClick={() => setModal(null)}><X size={14} /></button>
                </div>
                <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(['Admin','Teacher'] as const).map(role => {
                    const k = role.toLowerCase() as 'admin' | 'teacher';
                    return (
                      <div key={role} style={{ padding: 16, borderRadius: 12, background: 'var(--raised)', border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div className="label">{role} Password</div>
                          <span className="badge badge-active" style={{ fontSize: 9 }}>Shared Credential</span>
                        </div>
                        <div style={{ position: 'relative', marginBottom: 10 }}>
                          <input className="input" type={showPw[k] ? 'text' : 'password'} defaultValue={SA_PASSWORD} style={{ paddingRight: 38, fontFamily: 'monospace' }} />
                          <button onClick={() => setShowPw(p=>({...p,[k]:!p[k]}))} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex' }}>
                            {showPw[k] ? <EyeOff size={13}/> : <Eye size={13}/>}
                          </button>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ width: '100%', justifyContent: 'center', gap: 7 }}
                          onClick={() => showToast(`${role} password reset for ${sel.name}`)}
                        >
                          <KeyRound size={12} /> Reset {role} Password
                        </button>
                      </div>
                    );
                  })}
                  <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ justifyContent: 'center' }}>Close</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default function AcademiesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)', fontSize: 13 }}>Loading…</div>}>
      <AcademiesContent />
    </Suspense>
  );
}
