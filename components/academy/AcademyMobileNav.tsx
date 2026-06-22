"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { academyNav } from "@/components/academy/AcademySidebar";

export function AcademyMobileNav({ academyId }: { academyId: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = academyNav(academyId);
  const primary = nav.slice(0, 3); // Dashboard, Students, Attendance get bottom slots
  const rest = nav.slice(3);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur md:hidden">
        {primary.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                active ? "text-[var(--text)]" : "text-[var(--text-faint)]"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-[var(--text-faint)] cursor-pointer"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
          More
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative w-full rounded-t-2xl border-t border-[var(--border-hover)] bg-[var(--surface)] p-4 pb-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text)]">More</span>
              <button onClick={() => setOpen(false)} className="text-[var(--text-faint)] cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...primary, ...rest].map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border border-[var(--border)] py-3 text-[11px] font-medium",
                      active ? "bg-[var(--surface-2)] text-[var(--text)]" : "text-[var(--text-faint)]"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
