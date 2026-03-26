import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xs)] p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
          {icon}
        </span>
        <span className="text-sm text-[var(--color-ink-secondary)]">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-[var(--color-ink)] leading-none">
        {value}
      </p>
    </div>
  );
}
