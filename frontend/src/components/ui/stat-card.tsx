import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  /** Optional explicit color slot (1-4). Without it, use .stat-card-group nth-child CSS. */
  colorSlot?: 1 | 2 | 3 | 4;
}

const slotStyles: Record<number, { bg: string; icon: string }> = {
  1: { bg: "bg-[var(--color-stat-1-bg)]", icon: "text-[var(--color-stat-1-icon)]" },
  2: { bg: "bg-[var(--color-stat-2-bg)]", icon: "text-[var(--color-stat-2-icon)]" },
  3: { bg: "bg-[var(--color-stat-3-bg)]", icon: "text-[var(--color-stat-3-icon)]" },
  4: { bg: "bg-[var(--color-stat-4-bg)]", icon: "text-[var(--color-stat-4-icon)]" },
};

export function StatCard({ icon, label, value, colorSlot }: StatCardProps) {
  const explicit = colorSlot ? slotStyles[colorSlot] : null;

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] p-5 flex flex-col gap-4">
      {/* Icon area */}
      <span
        className={`stat-icon flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] ${explicit ? `${explicit.bg} ${explicit.icon}` : ""}`}
      >
        {/* Icon scaled up */}
        <span className="[&>svg]:h-6 [&>svg]:w-6">{icon}</span>
      </span>

      {/* Number — big, prominent */}
      <div>
        <p className="text-3xl font-bold text-[var(--color-ink)] leading-none tracking-tight">
          {value}
        </p>
        <p className="mt-1.5 text-sm text-[var(--color-ink-secondary)] font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}
