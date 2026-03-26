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
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-ink-secondary)] mb-1">
          {dict.dashboard.greeting}{" "}
          <span className="font-bold text-[var(--color-role-admin-text)]">
            {user?.name || user?.email}
          </span>
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.5px" }}>
          {t.title}
        </h2>
        {/* Accent underline */}
        <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[var(--color-role-admin-bold)] to-[#7c3aed]" />
      </div>

      {/* Stat grid */}
      <div className="stat-card-group grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users />} label={t.stats.users} value="—" />
        <StatCard icon={<BookOpen />} label={t.stats.classes} value="—" />
        <StatCard icon={<Shield />} label={t.stats.teachers} value="—" />
        <StatCard icon={<Bell />} label={t.stats.announcements} value="—" />
      </div>
    </div>
  );
}
