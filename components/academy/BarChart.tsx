export function BarChart({
  data,
  height = 160,
  color = "#3b82f6",
  formatValue,
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}) {
  if (data.length === 0) {
    return <div className="flex h-40 items-center justify-center text-xs text-[var(--text-faint)]">No data</div>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2 overflow-x-auto pb-1" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex min-w-[36px] flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-medium text-[var(--text-dim)]">
            {formatValue ? formatValue(d.value) : d.value}
          </span>
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${Math.max((d.value / max) * (height - 40), 4)}px`,
              backgroundColor: color,
              opacity: 0.85,
            }}
          />
          <span className="max-w-full truncate text-[10px] text-[var(--text-faint)]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
