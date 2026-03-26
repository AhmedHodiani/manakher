"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { StatCard } from "@/components/ui/stat-card";
import { BookOpen, Users, FileText, Bell } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { dict } = useLocale();
  const t = dict.dashboard.teacher;

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-ink-secondary)] mb-1">
          {dict.dashboard.greeting}{" "}
          <span className="font-bold text-[var(--color-role-teacher-text)]">
            {user?.name || user?.email}
          </span>
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.5px" }}>
          {t.title}
        </h2>
        <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[var(--color-role-teacher-bold)] to-[#0891b2]" />
      </div>

      <div className="stat-card-group grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<BookOpen />} label={t.stats.subjects} value="—" />
        <StatCard icon={<Users />} label={t.stats.students} value="—" />
        <StatCard icon={<FileText />} label={t.stats.assignments} value="—" />
        <StatCard icon={<Bell />} label={t.stats.pending} value="—" />
      </div>
    </div>
  );
}
