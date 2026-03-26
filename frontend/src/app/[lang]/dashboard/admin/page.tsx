"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { StatCard } from "@/components/ui/stat-card";
import { Shield, Users, BookOpen, Bell } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { dict } = useLocale();
  const t = dict.dashboard.admin;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm text-[var(--color-ink-secondary)]">
          {dict.dashboard.greeting}{" "}
          <span className="font-medium text-[var(--color-ink)]">
            {user?.name || user?.email}
          </span>
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">
          {t.title}
        </h2>
      </div>

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-4 w-4" />} label={t.stats.users} value="—" />
        <StatCard icon={<BookOpen className="h-4 w-4" />} label={t.stats.classes} value="—" />
        <StatCard icon={<Shield className="h-4 w-4" />} label={t.stats.teachers} value="—" />
        <StatCard icon={<Bell className="h-4 w-4" />} label={t.stats.announcements} value="—" />
      </div>
    </div>
  );
}
