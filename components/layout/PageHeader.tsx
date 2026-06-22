export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--text-faint)]">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
