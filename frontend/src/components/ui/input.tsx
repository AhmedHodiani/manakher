import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-[var(--color-ink)]"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-placeholder)] outline-none transition-all duration-150 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] focus:bg-white ${className}`}
      />
    </div>
  );
}
