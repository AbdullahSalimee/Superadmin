"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarCheck, Wallet, FileSpreadsheet,
  ClipboardList, BarChart3, BookOpen, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function academyNav(academyId: string) {
  const base = `/academy/${academyId}`;
  return [
    { href: `${base}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `${base}/students`, label: "Students", icon: Users },
    { href: `${base}/attendance`, label: "Attendance", icon: CalendarCheck },
    { href: `${base}/fees`, label: "Fees", icon: Wallet },
    { href: `${base}/fee-record`, label: "Fee Record", icon: FileSpreadsheet },
    { href: `${base}/tests`, label: "Tests", icon: ClipboardList },
    { href: `${base}/test-record`, label: "Test Record", icon: BookOpen },
    { href: `${base}/results`, label: "Results", icon: BarChart3 },
    { href: `${base}/classes`, label: "Classes & Subjects", icon: GraduationCap },
  ];
}

export function AcademySidebar({ academyId, academyName }: { academyId: string; academyName: string }) {
  const pathname = usePathname();
  const nav = academyNav(academyId);

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-[var(--border)] md:bg-[var(--surface)]">
      <div className="flex h-14 items-center gap-2 border-b border-[var(--border)] px-5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-2)] text-[10px] font-semibold text-[var(--text-dim)]">
          {academyName.slice(0, 2).toUpperCase()}
        </div>
        <span className="truncate text-sm font-semibold tracking-tight">{academyName}</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
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
        <div className="flex items-center gap-2 px-3 py-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-2)] text-[10px] font-semibold text-[var(--text-dim)]">
            A
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-[var(--text)]">Admin</p>
            <p className="text-[10px] text-[var(--text-faint)]">Full access</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
