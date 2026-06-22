"use client";

import { cn } from "@/lib/utils";

export function ProfileBox({
  label,
  value,
  tone = "default",
  onClick,
  disabled,
}: {
  label: string;
  value: string;
  tone?: "default" | "green" | "red" | "amber";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const toneClasses = {
    default: "text-[var(--text)]",
    green: "text-green-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-5 text-center transition-colors",
        !disabled && "hover:border-[var(--border-hover)] cursor-pointer",
        disabled && "cursor-default opacity-90"
      )}
    >
      <span className={cn("text-2xl font-semibold tracking-tight", toneClasses[tone])}>{value}</span>
      <span className="text-xs font-medium text-[var(--text-faint)]">{label}</span>
    </button>
  );
}
