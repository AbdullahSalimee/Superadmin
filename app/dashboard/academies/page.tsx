"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, MoreVertical, Pencil, Trash2, LogIn, X,
  Eye, EyeOff, Check, AlertTriangle, KeyRound,
  Building2, MapPin, Calendar, Hash
} from "lucide-react";
import type { Academy, AcademyStatus, AcademyRole } from "@/lib/queries/types";
import {
  listAcademies, createAcademy, updateAcademy, softDeleteAcademy,
  getAcademyRoles, resetRolePassword, getPlatformCounts,
} from "@/lib/queries/academies";
import { shortId } from "@/lib/format";

const PALETTES = [
  ['#00E599', '#00A36C'], ['#8B8FFF', '#5B5FD9'], ['#3DC4E8', '#1E8FB3'],
  ['#E8A33D', '#B97A1F'], ['#F2495C', '#C12E40'], ['#C9A8FF', '#9A6FE0'],
];
const colorOf = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
};

type Modal = 'create' | 'edit' | 'delete' | 'admins' | null;
type Counts = { students: number; classes: number; roleRows: number };

export default function AcademiesPage() {
  const router = useRouter();
  const [acs, setAcs] = useState<Academy[]>([]);
  const [counts, setCounts] = useState<Record<string, Counts>>({});
  const [roles, setRoles] = useState<Record<string, AcademyRole[]>>({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<Modal>(null);
  const [sel, setSel] = useState<Academy | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [showPw, setShowPw] = useState({ admin: false, teacher: false });
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', city: '', status: 'active' as AcademyStatus,
    adminPw: '', teacherPw: '', contactName: '', contactPhone: '',
  });
  const [newPw, setNewPw] = useState({ admin: '', teacher: '' });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listAcademies();
      setAcs(list);
      const countEntries = await Promise.all(list.map(async (a) => [a.id, await getPlatformCounts(a.id)] as const));
      setCounts(Object.fromEntries(countEntries));
    } catch (e) {
      showToast(`query failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() is a shared reusable fetcher (also called after mutations to refresh), not effect-only logic
  useEffect(() => { load(); }, [load]);

  const visble = acs.filter(a => {
    const ms = a.name.toLowerCase().includes(q.toLowerCase()) || a.city.toLowerCase().includes(q.toLowerCase()) || a.id.includes(q.toLowerCase());
    const mf = filter === 'all' || a.status === filter;
    return ms && mf;
  });

  const openCreate = () => {
    setForm({ name: '', city: '', status: 'active', adminPw: '', teacherPw: '', contactName: '', contactPhone: '' });
    setModal('create');
  };
  const openEdit = (a: Academy) => {
    setSel(a);
    setForm({ name: a.name, city: a.city, status: a.status, adminPw: '', teacherPw: '', contactName: a.contact_name ?? '', contactPhone: a.contact_phone ?? '' });
    setModal('edit'); setMenu(null);
  };
  const openDelete = (a: Academy) => { setSel(a); setConfirmName(''); setModal('delete'); setMenu(null); };
  const openAdmins = async (a: Academy) => {
    setSel(a); setModal('admins'); setMenu(null); setNewPw({ admin: '', teacher: '' });
    if (!roles[a.id]) {
      const r = await getAcademyRoles(a.id);
      setRoles((p) => ({ ...p, [a.id]: r }));
    }
  };

  const doCreate = async () => {
    if (!form.name || !form.adminPw || !form.teacherPw) return;
    setSaving(true);
    try {
      const created = await createAcademy({
        name: form.name, city: form.city || '—', status: form.status,
        contact_name: form.contactName || null, contact_phone: form.contactPhone || null,
        admin_password: form.adminPw, teacher_password: form.teacherPw,
      });
      setModal(null);
      showToast(`academy "${created.name}" created — academy_id ${shortId(created.id)}`);
      load();
    } catch (e) {
      showToast(`insert failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const doEdit = async () => {
    if (!sel || !form.name) return;
    setSaving(true);
    try {
      await updateAcademy(sel.id, {
        name: form.name, city: form.city, status: form.status,
        contact_name: form.contactName || null, contact_phone: form.contactPhone || null,
      });
      setModal(null); showToast("row updated"); load();
    } catch (e) {
      showToast(`update failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!sel || confirmName !== sel.name) return;
    setSaving(true);
    try {
      await softDeleteAcademy(sel.id);
      setModal(null); showToast(`"${sel.name}" soft-deleted`); load();
    } catch (e) {
      showToast(`delete failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const doResetPw = async (role: 'admin' | 'teacher') => {
    if (!sel) return;
    const pw = newPw[role];
    if (!pw || pw.length < 4) { showToast('enter a password (min 4 chars)'); return; }
    try {
      await resetRolePassword(sel.id, role, pw);
      showToast(`${role} password reset for ${sel.name}`);
      setNewPw((p) => ({ ...p, [role]: '' }));
    } catch (e) {
      showToast(`reset failed: ${(e as Error).message}`);
    }
  };

  return (
    <div style={{ padding: '24px 24px 40px' }}>

      {toast && (
        <div className="mono" style={{
          position: 'fixed', top: 18, right: 22, zIndex: 200,
          background: 'var(--card)', border: '1px solid var(--line-md)',
          borderRadius: 'var(--r-md)', padding: '10px 15px',
          display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          fontSize: 12, fontWeight: 600, color: 'var(--t1)',
        }}>
          <Check size={13} color="var(--acc)" /> {toast}
        </div>
      )}

      <div className="anim-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>platform / academies</div>
          <h1 className="display">All Academies</h1>
          <p className="body mono" style={{ marginTop: 5, fontSize: 12 }}>
            {loading ? 'querying…' : `${acs.length} tenants · ${acs.filter(a => a.status === 'active').length} active`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={13} strokeWidth={2.5} /> new academy
        </button>
      </div>

      <div className="anim-up" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={12} color="var(--t3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input className="input" placeholder="search name, city, or academy_id…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'trial', 'suspended'].map(s => (
            <button key={s} className={`chip${filter === s ? ' on' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--t3)' }}>{visble.length} rows</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {visble.map((ac, i) => {
          const [c1, c2] = colorOf(ac.id);
          const cnt = counts[ac.id] ?? { students: 0, classes: 0, roleRows: 0 };
          return (
            <div key={ac.id} className={`card card-hover anim-up d${Math.min(i + 1, 6)}`} style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c1}, ${c2})`, opacity: 0.8 }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div className="avatar" style={{ width: 38, height: 38, fontSize: 15, background: `${c1}1a`, color: c1, border: `1px solid ${c1}40` }}>{ac.name.charAt(0)}</div>
                  <div>
                    <div className="title" style={{ marginBottom: 4 }}>{ac.name}</div>
                    <span className={`badge badge-${ac.status}`}>{ac.status}</span>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button className="btn-icon" onClick={e => { e.stopPropagation(); setMenu(menu === ac.id ? null : ac.id); }} aria-label="Academy actions">
                    <MoreVertical size={13} color="var(--t3)" />
                  </button>
                  {menu === ac.id && (
                    <div className="menu-drop">
                      <button className="menu-item" onClick={() => openEdit(ac)}><Pencil size={12} /> edit_academy()</button>
                      <button className="menu-item" onClick={() => openAdmins(ac)}><KeyRound size={12} /> manage_credentials()</button>
                      <button className="menu-item" onClick={() => router.push(`/dashboard/academies/${ac.id}`)}><LogIn size={12} /> enter_academy()</button>
                      <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                      <button className="menu-item danger" onClick={() => openDelete(ac)}><Trash2 size={12} /> delete_academy()</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mono" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--t3)' }}><Hash size={10} /> {shortId(ac.id)}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--t3)' }}><MapPin size={10} /> {ac.city}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--t3)' }}><Calendar size={10} /> {new Date(ac.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'var(--raised)', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--line)', marginBottom: 14 }}>
                {[
                  { val: cnt.students, label: 'students' },
                  { val: cnt.classes, label: 'classes' },
                  { val: cnt.roleRows, label: 'role_rows' },
                ].map((s, si) => (
                  <div key={s.label} style={{ padding: '11px 8px', textAlign: 'center', borderRight: si < 2 ? '1px solid var(--line)' : 'none' }}>
                    <div className="data" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 2 }}>{s.val}</div>
                    <div className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--t3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ac)} style={{ flex: 1 }}><Pencil size={10} /> edit</button>
                <button className="btn btn-primary btn-sm" onClick={() => router.push(`/dashboard/academies/${ac.id}`)} style={{ flex: 2 }}><LogIn size={10} /> enter academy</button>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && visble.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Building2 size={32} color="var(--t3)" style={{ margin: '0 auto 12px' }} />
          <div className="title" style={{ marginBottom: 6 }}>no rows match this query</div>
          <p className="body mono" style={{ fontSize: 11.5 }}>adjust search or filter and try again</p>
        </div>
      )}

      {menu && <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenu(null)} />}

      {modal && (
        <div className="modal-bg" onClick={() => !saving && setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            {(modal === 'create' || modal === 'edit') && (
              <>
                <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <h2 className="title" style={{ fontSize: 15, marginBottom: 3 }}>
                        {modal === 'create' ? 'insert into academies' : `update academies where id = '${shortId(sel?.id ?? '')}'`}
                      </h2>
                      <p className="body" style={{ fontSize: 11.5 }}>
                        {modal === 'create' ? 'onboard a new tenant to the platform' : 'update academy details and configuration'}
                      </p>
                    </div>
                    <button className="btn-icon" onClick={() => setModal(null)} aria-label="Close"><X size={13} /></button>
                  </div>
                </div>
                <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>name *</label>
                      <input className="input" placeholder="e.g. Superior Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus />
                    </div>
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>city</label>
                      <input className="input" placeholder="e.g. Lahore" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>status *</label>
                      <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as AcademyStatus }))}>
                        <option value="active">active</option>
                        <option value="trial">trial</option>
                        <option value="suspended">suspended</option>
                      </select>
                    </div>
                    {modal === 'create' && (
                      <>
                        <div>
                          <label className="label" style={{ display: 'block', marginBottom: 6 }}>admin_password *</label>
                          <div style={{ position: 'relative' }}>
                            <input className="input" type={showPw.admin ? 'text' : 'password'} placeholder="set admin password" value={form.adminPw} onChange={e => setForm(p => ({ ...p, adminPw: e.target.value }))} style={{ paddingRight: 36 }} />
                            <button onClick={() => setShowPw(p => ({ ...p, admin: !p.admin }))} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', display: 'flex' }}>
                              {showPw.admin ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="label" style={{ display: 'block', marginBottom: 6 }}>teacher_password *</label>
                          <div style={{ position: 'relative' }}>
                            <input className="input" type={showPw.teacher ? 'text' : 'password'} placeholder="set teacher password" value={form.teacherPw} onChange={e => setForm(p => ({ ...p, teacherPw: e.target.value }))} style={{ paddingRight: 36 }} />
                            <button onClick={() => setShowPw(p => ({ ...p, teacher: !p.teacher }))} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', display: 'flex' }}>
                              {showPw.teacher ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>contact_name</label>
                      <input className="input" placeholder="academy director" value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label" style={{ display: 'block', marginBottom: 6 }}>contact_phone</label>
                      <input className="input" placeholder="03XX-XXXXXXX" value={form.contactPhone} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                    <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ flex: 1 }}>cancel</button>
                    <button className="btn btn-primary" onClick={modal === 'create' ? doCreate : doEdit} disabled={saving} style={{ flex: 1 }}>
                      <Check size={12} /> {saving ? 'writing…' : modal === 'create' ? 'create academy' : 'save changes'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {modal === 'delete' && sel && (
              <>
                <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 className="title" style={{ fontSize: 15, color: 'var(--red)', marginBottom: 3 }}>delete from academies</h2>
                    <p className="body" style={{ fontSize: 11.5 }}>this is a soft-delete — cannot be undone from this UI</p>
                  </div>
                  <button className="btn-icon" onClick={() => setModal(null)} aria-label="Close"><X size={13} /></button>
                </div>
                <div style={{ padding: '18px 22px 22px' }}>
                  <div style={{ padding: '12px 13px', borderRadius: 'var(--r-md)', marginBottom: 16, background: 'var(--red-dim)', border: '1px solid rgba(242,73,92,0.22)' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <AlertTriangle size={13} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                        Soft-deleting <strong style={{ color: 'var(--t1)' }}>{sel.name}</strong> sets <code className="mono">status = &apos;deleted&apos;</code>, hiding it from all views and platform totals. All rows ({counts[sel.id]?.students ?? 0} students, fee_records, attendance_records, tests) stay intact in the database.
                      </p>
                    </div>
                  </div>
                  <label className="label" style={{ display: 'block', marginBottom: 7 }}>
                    type &ldquo;<span style={{ color: 'var(--t1)', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>{sel.name}</span>&rdquo; to confirm
                  </label>
                  <input
                    className="input" placeholder="academy name…" value={confirmName} onChange={e => setConfirmName(e.target.value)}
                    style={{ marginBottom: 16, borderColor: confirmName === sel.name ? 'var(--red)' : undefined }}
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ flex: 1 }}>cancel</button>
                    <button
                      className="btn btn-danger" onClick={doDelete} disabled={confirmName !== sel.name || saving}
                      style={{ flex: 1, opacity: confirmName === sel.name ? 1 : 0.4, cursor: confirmName === sel.name ? 'pointer' : 'not-allowed' }}
                    >
                      <Trash2 size={12} /> {saving ? 'writing…' : 'delete academy'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {modal === 'admins' && sel && (
              <>
                <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 className="title" style={{ fontSize: 15, marginBottom: 3 }}>academy_roles</h2>
                    <p className="body" style={{ fontSize: 11.5 }}>{sel.name} · shared-credential rows</p>
                  </div>
                  <button className="btn-icon" onClick={() => setModal(null)} aria-label="Close"><X size={13} /></button>
                </div>
                <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>
                  {(['admin', 'teacher'] as const).map(role => {
                    const k = role;
                    const row = (roles[sel.id] ?? []).find(r => r.role === role);
                    return (
                      <div key={role} style={{ padding: 15, borderRadius: 'var(--r-md)', background: 'var(--raised)', border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
                          <div className="label">role = &apos;{role}&apos;</div>
                          <span className="badge badge-active" style={{ fontSize: 9 }}>shared credential</span>
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 8 }}>row_id: {row ? shortId(row.id) : '—'}</div>
                        <div style={{ position: 'relative', marginBottom: 10 }}>
                          <input
                            className="input" type={showPw[k] ? 'text' : 'password'} placeholder={`set new ${role} password`}
                            value={newPw[k]} onChange={e => setNewPw(p => ({ ...p, [k]: e.target.value }))}
                            style={{ paddingRight: 36, fontFamily: 'var(--font-mono)' }}
                          />
                          <button onClick={() => setShowPw(p => ({ ...p, [k]: !p[k] }))} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', display: 'flex' }}>
                            {showPw[k] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', gap: 7 }} onClick={() => doResetPw(role)}>
                          <KeyRound size={11} /> reset {role} password
                        </button>
                      </div>
                    );
                  })}
                  <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ justifyContent: 'center' }}>close</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
