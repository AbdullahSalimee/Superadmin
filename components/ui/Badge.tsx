import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "green" | "red" | "amber" | "blue" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--surface-2)] text-[var(--text-dim)] border-[var(--border)]",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  outline: "bg-transparent text-[var(--text-dim)] border-[var(--border-hover)]",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
