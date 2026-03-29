"use client";

import { useLocale } from "@/context/locale-context";
import { Clock } from "lucide-react";

export default function MaintenancePage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.maintenance;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dotted px-4 text-center">
      <div className="max-w-md w-full bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-10 space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center">
            <Clock className="h-12 w-12 text-[var(--color-accent)] animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-[var(--color-ink)] leading-tight">{t.title}</h1>
          <p className="text-[var(--color-ink-secondary)] leading-relaxed font-semibold">
            {t.message}
          </p>
        </div>

        <div className="pt-8 border-t border-[var(--color-border-subtle)]">
          <p className="text-sm font-black text-[var(--color-accent)] tracking-wide">
            {t.schoolName}
          </p>
        </div>
      </div>
    </div>
  );
}
