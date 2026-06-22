import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

export const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-[var(--text-dim)]">
    {children}
  </label>
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-[var(--border-hover)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]",
        "outline-none focus:ring-2 focus:ring-white/20 focus:border-[var(--text-faint)] transition-colors",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[var(--border-hover)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]",
        "outline-none focus:ring-2 focus:ring-white/20 focus:border-[var(--text-faint)] transition-colors resize-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-[var(--border-hover)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)]",
        "outline-none focus:ring-2 focus:ring-white/20 focus:border-[var(--text-faint)] transition-colors",
        "disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
