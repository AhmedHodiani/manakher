"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { StatCard } from "@/components/ui/stat-card";
import { getDisplayName } from "@/lib/auth";
import { getPocketBase } from "@/lib/pocketbase";
import { BookOpen, Users, FileText, Clock } from "lucide-react";
import { DashboardAnnouncements } from "@/components/dashboard-announcements";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { dict, locale } = useLocale();
  const t = dict.dashboard.teacher;
  const displayName = user ? getDisplayName(user, locale) : "";

  const [subjectCount, setSubjectCount] = useState<number | string>("—");
  const [studentCount, setStudentCount] = useState<number | string>("—");
  const [hwCount, setHwCount] = useState<number | string>("—");
  const [pendingCount, setPendingCount] = useState<number | string>("—");

  useEffect(() => {
    if (!user) return;
    const pb = getPocketBase();

    // Count unique subjects assigned to this teacher
    const subjects: string[] = (user as any).subjects ?? [];
    setSubjectCount(subjects.length);

    // Count students in teacher's sections
    const sections: string[] = (user as any).sections ?? [];
    if (sections.length > 0) {
      const sectionFilter = sections.map((id) => `sections.id = "${id}"`).join(" || ");
      pb.collection("users")
        .getList(1, 1, { filter: `role = "student" && (${sectionFilter})` })
        .then((r) => setStudentCount(r.totalItems))
        .catch(() => setStudentCount("—"));
    } else {
      setStudentCount(0);
    }

    // Count homework posted by this teacher
    pb.collection("homework")
      .getList(1, 1, { filter: `teacher = "${user.id}"` })
      .then((r) => setHwCount(r.totalItems))
      .catch(() => setHwCount("—"));

    // Count submitted (ungraded) submissions for this teacher's homework
    pb.collection("submissions")
      .getList(1, 1, {
        filter: `status = "submitted" && homework.teacher = "${user.id}"`,
      })
      .then((r) => setPendingCount(r.totalItems))
      .catch(() => setPendingCount("—"));
  }, [user]);

  return (
    <div className="space-y-8">

      {/* ── Welcome banner ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-[var(--radius-2xl)] p-7 shadow-[var(--shadow-md)]"
        style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0891b2 100%)" }}
      >
        <div className="absolute rounded-full opacity-10" style={{ width: 260, height: 260, background: "#fff", top: -80, insetInlineEnd: -60 }} />
        <div className="absolute rounded-full opacity-[0.07]" style={{ width: 140, height: 140, background: "#fff", bottom: -40, insetInlineStart: 40 }} />
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-semibold mb-1">
            {dict.dashboard.greeting} {displayName}
          </p>
          <h2 className="text-white text-2xl font-black" style={{ letterSpacing: "-0.5px" }}>
            {t.title}
          </h2>
          <p className="text-teal-100 text-xs mt-2 font-medium opacity-80">
            {dict.common.schoolName}
          </p>
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-base font-black text-[var(--color-ink)] mb-4" style={{ letterSpacing: "-0.2px" }}>
          {locale === "ar" ? "نظرة عامة" : "Overview"}
        </h3>
        <div className="stat-card-group grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<BookOpen />} label={t.stats.subjects} value={subjectCount} />
          <StatCard icon={<Users />} label={t.stats.students} value={studentCount} />
          <StatCard icon={<FileText />} label={t.stats.assignments} value={hwCount} />
          <StatCard icon={<Clock />} label={t.stats.pending} value={pendingCount} />
        </div>
      </div>

      {/* ── Announcements ────────────────────────────────────────────── */}
      <DashboardAnnouncements role="teacher" />

    </div>
  );
}
