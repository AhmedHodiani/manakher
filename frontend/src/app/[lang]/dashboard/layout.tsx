"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getRoleDashboardPath } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { LogOut, Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const { dict, locale, switchLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "ar" ? "en" : "ar";

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    const allowedPath = getRoleDashboardPath(user.role, locale);
    if (!pathname.startsWith(allowedPath)) {
      router.replace(allowedPath);
    }
  }, [isLoading, user, router, pathname, locale]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-ink-placeholder)]" />
      </div>
    );
  }

  if (!user) return null;

  const allowedPath = getRoleDashboardPath(user.role, locale);
  if (!pathname.startsWith(allowedPath)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-ink-placeholder)]" />
      </div>
    );
  }

  const role = user.role as "admin" | "teacher" | "student";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-xs)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Left: brand + role */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]">
              <span className="text-sm font-bold text-white">م</span>
            </div>
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              {dict.common.appName}
            </span>
            <Badge variant={role}>{dict.roles[role]}</Badge>
          </div>

          {/* Right: user name, lang switcher, sign out */}
          <div className="flex items-center gap-1">
            <span className="hidden sm:block text-sm text-[var(--color-ink-secondary)] px-2">
              {user.name || user.email}
            </span>

            {/* Language switcher */}
            <button
              onClick={() => switchLocale(nextLocale)}
              className="rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] transition-colors"
            >
              {dict.common.switchLang}
            </button>

            {/* Sign out */}
            <button
              onClick={() => {
                logout();
                router.push(`/${locale}/login`);
              }}
              className="flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{dict.common.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
