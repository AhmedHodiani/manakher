type BadgeVariant = "default" | "admin" | "teacher" | "student" | "accent";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface-sunken)] text-[var(--color-ink-secondary)]",
  admin:
    "bg-[var(--color-role-admin-bg)] text-[var(--color-role-admin-text)]",
  teacher:
    "bg-[var(--color-role-teacher-bg)] text-[var(--color-role-teacher-text)]",
  student:
    "bg-[var(--color-role-student-bg)] text-[var(--color-role-student-text)]",
  accent:
    "bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]",
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
      className={`inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
