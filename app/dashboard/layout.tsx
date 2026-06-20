"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Terminal, LayoutGrid, Building2, Users, BarChart3, Settings, LogOut, Bell, ChevronDown, Database } from "lucide-react";

const NAV = [
  { icon: LayoutGrid,  label: 'overview',   href: '/dashboard' },
  { icon: Building2,   label: 'academies',  href: '/dashboard/academies' },
  { icon: Users,       label: 'staff',      href: '/dashboard/staff' },
  { icon: BarChart3,   label: 'analytics',  href: '/dashboard/analytics' },
  { icon: Settings,    label: 'settings',   href: '/dashboard/settings' },
];

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [authorized] = useState<boolean>(() =>
    typeof window !== 'undefined' && !!sessionStorage.getItem("sa")
  );
  const [clock, setClock] = useState("");

  useEffect(() => {
    if (!authorized) router.replace("/");
  }, [authorized, router]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const signOut = () => { sessionStorage.removeItem("sa"); router.push("/"); };

  if (!authorized) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--base)' }}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">

        {/* Brand */}
        <div style={{ padding: '18px 14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, flexShrink: 0,
              background: 'var(--acc-dim)', border: '1px solid var(--line-acc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Terminal size={14} color="var(--acc)" strokeWidth={2.2} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--t1)', lineHeight: 1 }}>academy-platform</div>
              <div className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--t3)', marginTop: 3 }}>superadmin console</div>
            </div>
          </div>
        </div>

        <div style={{ margin: '0 14px 12px', height: 1, background: 'var(--line)' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div className="label" style={{ padding: '4px 10px 6px' }}>navigate</div>
          {NAV.map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href} className={`nav-link${path === href ? ' active' : ''}`}>
              <Icon size={14} strokeWidth={path === href ? 2.3 : 1.8} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 10px' }}>
          <div style={{ margin: '0 2px 10px', height: 1, background: 'var(--line)' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '7px 9px', borderRadius: 'var(--r-sm)', cursor: 'pointer',
            transition: 'background 0.12s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="avatar" style={{
              width: 26, height: 26, fontSize: 10,
              background: 'var(--acc-dim)', border: '1px solid var(--line-acc)',
              color: 'var(--acc)',
            }}>SA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)', lineHeight: 1 }}>super_admin</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>platform@ams.internal</div>
            </div>
            <ChevronDown size={11} color="var(--t3)" />
          </div>

          <button
            onClick={signOut}
            className="nav-link"
            style={{ width: '100%', border: 'none', background: 'none', marginTop: 2, color: 'var(--red)' }}
          >
            <LogOut size={13} strokeWidth={1.8} />
            sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Topbar — status line */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="dot-live" />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t2)' }}>platform.online</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Database size={11} color="var(--t3)" />
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>supabase · connected</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--t3)', letterSpacing: '0.02em' }}>{clock || '—'}</span>
            <button className="btn-icon" style={{ position: 'relative' }} aria-label="Notifications">
              <Bell size={13} color="var(--t2)" />
              <div style={{
                position: 'absolute', top: 5, right: 5, width: 5, height: 5,
                borderRadius: '50%', background: 'var(--red)',
                border: '1.5px solid var(--surface)'
              }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
