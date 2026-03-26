"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getRoleDashboardPath } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { LogOut, Loader2 } from "lucide-react";

/* Role-specific header accent strip color */
const roleHeaderAccent: Record<string, string> = {
  admin:   "from-[var(--color-role-admin-bold)] to-[#7c3aed]",
  teacher: "from-[var(--color-role-teacher-bold)] to-[#0891b2]",
  student: "from-[var(--color-role-student-bold)] to-[#f59e0b]",
};

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
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (!user) return null;

  const allowedPath = getRoleDashboardPath(user.role, locale);
  if (!pathname.startsWith(allowedPath)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  const role = user.role as "admin" | "teacher" | "student";
  const accentGradient = roleHeaderAccent[role] ?? roleHeaderAccent.admin;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-surface-card)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        {/* Role color strip — 3px accent bar at the top */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${accentGradient}`} />

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Left: brand + role */}
          <div className="flex items-center gap-3">
            {/* Brand mark */}
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br ${accentGradient} shadow-[var(--shadow-xs)]`}
            >
              <span className="text-base font-black text-white">م</span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-black text-[var(--color-ink)] leading-tight tracking-tight">
                {dict.common.appName}
              </span>
            </div>

            <Badge variant={role}>{dict.roles[role]}</Badge>
          </div>

          {/* Right: user name, lang switcher, sign out */}
          <div className="flex items-center gap-1">
            {/* User name */}
            <span className="hidden sm:block text-sm font-medium text-[var(--color-ink-secondary)] px-2">
              {user.name || user.email}
            </span>

            {/* Language switcher */}
            <button
              onClick={() => switchLocale(nextLocale)}
              className="rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] transition-colors"
            >
              {dict.common.switchLang}
            </button>

            {/* Sign out */}
            <button
              onClick={() => {
                logout();
                router.push(`/${locale}/login`);
              }}
              className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-secondary)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-text)] transition-colors"
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
