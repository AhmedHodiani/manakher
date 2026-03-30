import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
  secondary:
    "bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)] hover:bg-[var(--color-accent)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]",
  danger:
    "bg-[var(--color-danger-subtle)] text-[var(--color-danger-text)] hover:bg-[var(--color-danger)] hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-xs",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition-all duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
