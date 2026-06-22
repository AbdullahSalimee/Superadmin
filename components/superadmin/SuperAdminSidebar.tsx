"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/academies", label: "Academies", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-[var(--border)] md:bg-[var(--surface)]">
      <div className="flex h-14 items-center gap-2 border-b border-[var(--border)] px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
          <ShieldCheck className="h-4 w-4 text-black" strokeWidth={2} />
        </div>
        <span className="text-sm font-semibold tracking-tight">Platform</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text-dim)]"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <Link
          href="/login"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text-dim)] transition-colors"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sign out
        </Link>
        <div className="mt-2 flex items-center gap-2 px-3 py-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-2)] text-[10px] font-semibold text-[var(--text-dim)]">
            SA
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-[var(--text)]">Super Admin</p>
            <p className="text-[10px] text-[var(--text-faint)]">Platform owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
