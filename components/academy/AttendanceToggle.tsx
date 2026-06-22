import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";

export function AttendanceToggle({
  value,
  onChange,
}: {
  value: AttendanceStatus | null;
  onChange: (status: AttendanceStatus) => void;
}) {
  const options: { key: AttendanceStatus; label: string; activeClass: string }[] = [
    { key: "P", label: "P", activeClass: "bg-green-500/15 text-green-400 border-green-500/40" },
    { key: "A", label: "A", activeClass: "bg-red-500/15 text-red-400 border-red-500/40" },
    { key: "L", label: "L", activeClass: "bg-amber-500/15 text-amber-400 border-amber-500/40" },
  ];

  return (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors cursor-pointer",
            value === opt.key
              ? opt.activeClass
              : "border-[var(--border-hover)] text-[var(--text-faint)] hover:bg-[var(--surface-2)]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
