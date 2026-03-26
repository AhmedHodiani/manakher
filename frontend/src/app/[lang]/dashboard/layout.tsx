"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getRoleDashboardPath } from "@/lib/auth";
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) return null;

  // Prevent flash of unauthorized content
  const allowedPath = getRoleDashboardPath(user.role, locale);
  if (!pathname.startsWith(allowedPath)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const roleLabelKey = user.role as "admin" | "teacher" | "student";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-slate-900">
              {dict.common.appName}
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {dict.roles[roleLabelKey]}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {user.name || user.email}
            </span>
            {/* Language switcher */}
            <button
              onClick={() => switchLocale(nextLocale)}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              {dict.common.switchLang}
            </button>
            <button
              onClick={() => {
                logout();
                router.push(`/${locale}/login`);
              }}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              {dict.common.signOut}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
