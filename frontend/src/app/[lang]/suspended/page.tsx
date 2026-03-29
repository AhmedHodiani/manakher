"use client";

import { useLocale } from "@/context/locale-context";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SuspendedPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.suspended;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dotted)] px-4">
      <div className="max-w-md w-full bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[var(--color-ink)]">{t.title}</h1>
          <p className="text-[var(--color-ink-secondary)] leading-relaxed font-semibold">
            {t.message}
          </p>
        </div>

        <div className="pt-4">
          <Link href={`/${locale}/login`}>
            <Button variant="secondary" className="w-full">
              {t.backToLogin}
            </Button>
          </Link>
        </div>
        
        <div className="pt-6 border-t border-[var(--color-border-subtle)]">
          <p className="text-xs font-bold text-[var(--color-ink-secondary)] uppercase tracking-wider opacity-60">
            {locale === "ar" ? "مدرسة المناخر الأساسية المؤنثة" : "Almanakher Elementary School"}
          </p>
        </div>
      </div>
    </div>
  );
}
