"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, Building2, Users, BarChart3, Settings, LogOut, Bell, ChevronDown } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: 'Overview',   href: '/dashboard' },
  { icon: Building2,       label: 'Academies',  href: '/dashboard/academies' },
  { icon: Users,           label: 'Staff',       href: '/dashboard/staff' },
  { icon: BarChart3,       label: 'Analytics',   href: '/dashboard/analytics' },
  { icon: Settings,        label: 'Settings',    href: '/dashboard/settings' },
];

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("sa")) router.replace("/");
    else setReady(true);
  }, [router]);

  const signOut = () => { sessionStorage.removeItem("sa"); router.push("/"); };

  if (!ready) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--base)' }}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">

        {/* Brand */}
        <div style={{ padding: '20px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, #478BFF, #2B5CE6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(71,139,255,0.35)',
            }}>
              <ShieldCheck size={15} color="white" strokeWidth={2.3} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--t1)', lineHeight: 1 }}>SuperAdmin</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--blu)', marginTop: 2 }}>Platform Console</div>
            </div>
          </div>
        </div>

        <div style={{ margin: '0 14px 14px', height: 1, background: 'var(--line)' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href} className={`nav-link${path === href ? ' active' : ''}`}>
              <Icon size={15} strokeWidth={path === href ? 2.3 : 1.9} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 10px' }}>
          <div style={{ margin: '0 2px 10px', height: 1, background: 'var(--line)' }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
            transition: 'background 0.12s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="avatar" style={{
              width: 28, height: 28, fontSize: 10, fontWeight: 800,
              background: 'linear-gradient(135deg, #478BFF, #9F7AEA)',
              color: 'white',
            }}>SA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', lineHeight: 1 }}>Super Admin</div>
              <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>platform@ams.io</div>
            </div>
            <ChevronDown size={11} color="var(--t3)" />
          </div>

          <button
            onClick={signOut}
            className="nav-link"
            style={{ width: '100%', border: 'none', background: 'none', marginTop: 2, color: 'var(--red)' }}
          >
            <LogOut size={14} strokeWidth={1.9} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="dot-live" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)' }}>Platform Online</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, letterSpacing: '0.02em' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button className="btn-icon" style={{ position: 'relative' }}>
              <Bell size={14} color="var(--t2)" />
              <div style={{
                position: 'absolute', top: 5, right: 5, width: 6, height: 6,
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
