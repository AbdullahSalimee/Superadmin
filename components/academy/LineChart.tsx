export function LineChart({
  data,
  height = 160,
  color = "#3b82f6",
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  if (data.length === 0) {
    return <div className="flex h-40 items-center justify-center text-xs text-[var(--text-faint)]">No data</div>;
  }
  const width = Math.max(data.length * 60, 280);
  const max = 100;
  const min = 0;
  const padX = 20;
  const padY = 16;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * (width - padX * 2);
    const y = padY + (1 - (d.value - min) / (max - min)) * (height - padY * 2);
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="block">
        <polyline
          points={`${padX},${height - padY} ${points.map((p) => `${p.x},${p.y}`).join(" ")} ${width - padX},${height - padY}`}
          fill={color}
          fillOpacity={0.08}
          stroke="none"
        />
        <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={3} fill={color} />
            <text x={p.x} y={height - 2} textAnchor="middle" className="fill-[var(--text-faint)]" fontSize={9}>
              {p.label}
            </text>
            <text x={p.x} y={p.y - 8} textAnchor="middle" className="fill-[var(--text-dim)]" fontSize={9} fontWeight={600}>
              {p.value}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
