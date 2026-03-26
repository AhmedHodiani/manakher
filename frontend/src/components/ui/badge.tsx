type BadgeVariant = "default" | "admin" | "teacher" | "student" | "accent";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface-sunken)] text-[var(--color-ink-secondary)]",
  admin:
    "bg-[var(--color-role-admin-bg)] text-[var(--color-role-admin-text)] font-semibold",
  teacher:
    "bg-[var(--color-role-teacher-bg)] text-[var(--color-role-teacher-text)] font-semibold",
  student:
    "bg-[var(--color-role-student-bg)] text-[var(--color-role-student-text)] font-semibold",
  accent:
    "bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)] font-semibold",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
