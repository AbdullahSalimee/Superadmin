import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 transition-colors hover:border-[var(--border-hover)]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-wide">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-[var(--text-faint)]" strokeWidth={1.75} />}
      </div>
      <div className="mt-2.5 text-2xl font-semibold tracking-tight text-[var(--text)]">
        {value}
      </div>
      {hint && <p className="mt-1 text-xs text-[var(--text-faint)]">{hint}</p>}
    </div>
  );
}
