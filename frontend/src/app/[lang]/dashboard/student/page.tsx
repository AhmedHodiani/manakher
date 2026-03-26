"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { StatCard } from "@/components/ui/stat-card";
import { BookOpen, FileText, ClipboardList, Bell } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { dict } = useLocale();
  const t = dict.dashboard.student;

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-ink-secondary)] mb-1">
          {dict.dashboard.greeting}{" "}
          <span className="font-bold text-[var(--color-role-student-text)]">
            {user?.name || user?.email}
          </span>
        </p>
        <h2 className="text-3xl font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.5px" }}>
          {t.title}
        </h2>
        <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-[var(--color-role-student-bold)] to-[#f59e0b]" />
      </div>

      <div className="stat-card-group grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<BookOpen />} label={t.stats.subjects} value="—" />
        <StatCard icon={<FileText />} label={t.stats.homework} value="—" />
        <StatCard icon={<ClipboardList />} label={t.stats.quizzes} value="—" />
        <StatCard icon={<Bell />} label={t.stats.announcements} value="—" />
      </div>
    </div>
  );
}
