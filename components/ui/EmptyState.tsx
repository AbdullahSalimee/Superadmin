import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-hover)] py-16 px-6 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)]">
        <Icon className="h-5 w-5 text-[var(--text-faint)]" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-[var(--text-faint)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
