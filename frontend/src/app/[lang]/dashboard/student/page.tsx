"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { StatCard } from "@/components/ui/stat-card";
import { getDisplayName } from "@/lib/auth";
import { getPocketBase } from "@/lib/pocketbase";
import { BookOpen, FileText, Send, Bell } from "lucide-react";
import { DashboardAnnouncements } from "@/components/dashboard-announcements";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { dict, locale } = useLocale();
  const t = dict.dashboard.student;
  const displayName = user ? getDisplayName(user, locale) : "";

  const [subjectCount, setSubjectCount] = useState<number | string>("—");
  const [hwCount, setHwCount] = useState<number | string>("—");
  const [submittedCount, setSubmittedCount] = useState<number | string>("—");
  const [announcementCount, setAnnouncementCount] = useState<number | string>("—");

  useEffect(() => {
    if (!user) return;
    const pb = getPocketBase();
    const sections: string[] = (user as any).sections ?? [];

    if (sections.length === 0) {
      setSubjectCount(0);
      setHwCount(0);
      setAnnouncementCount(0);
      setSubmittedCount(0);
      return;
    }

    const sectionId = sections[0];
    const sectionFilter = sections.map((id) => `section = "${id}"`).join(" || ");
    const annFilter = sections.map((id) => `section = "${id}"`).join(" || ");

    // Count homework and submissions to show progress
    Promise.all([
      pb.collection("homework").getList(1, 1, { filter: sectionFilter }),
      pb.collection("submissions").getList(1, 1, { filter: `student = "${user.id}"` })
    ]).then(([hw, subs]) => {
      const total = hw.totalItems;
      const submitted = subs.totalItems;
      const remaining = Math.max(0, total - submitted);
      setHwCount(`${remaining} / ${total}`);
      setSubmittedCount(submitted);
    }).catch(() => {
      setHwCount("—");
      setSubmittedCount("—");
    });

    // Count announcements for student's section + global ones
    pb.collection("announcements")
      .getList(1, 1, {
        filter: `scope = "global" || (${annFilter})`,
      })
      .then((r) => setAnnouncementCount(r.totalItems))
      .catch(() => setAnnouncementCount("—"));

    // Count distinct subjects via materials in student's section
    pb.collection("materials")
      .getFullList({ filter: sectionFilter, fields: "subject" })
      .then((mats) => {
        const unique = new Set(mats.map((m: any) => m.subject));
        setSubjectCount(unique.size);
      })
      .catch(() => setSubjectCount("—"));
  }, [user]);

  return (
    <div className="space-y-8">

      {/* ── Welcome banner ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-[var(--radius-2xl)] p-7 shadow-[var(--shadow-md)]"
        style={{ background: "linear-gradient(135deg, #c2410c 0%, #ea580c 60%, #f59e0b 100%)" }}
      >
        <div className="absolute rounded-full opacity-10" style={{ width: 260, height: 260, background: "#fff", top: -80, insetInlineEnd: -60 }} />
        <div className="absolute rounded-full opacity-[0.07]" style={{ width: 140, height: 140, background: "#fff", bottom: -40, insetInlineStart: 40 }} />

        <div className="relative z-10">
          <p className="text-orange-200 text-sm font-semibold mb-1">
            {dict.dashboard.greeting} {displayName}
          </p>
          <h2 className="text-white text-2xl font-black" style={{ letterSpacing: "-0.5px" }}>
            {t.title}
          </h2>
          <p className="text-orange-100 text-xs mt-2 font-medium opacity-80">
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
          <StatCard icon={<FileText />} label={t.stats.homework} value={hwCount} />
          <StatCard icon={<Send />} label={t.stats.submitted} value={submittedCount} />
          <StatCard icon={<Bell />} label={t.stats.announcements} value={announcementCount} />
        </div>
      </div>

      {/* ── Announcements ────────────────────────────────────────────── */}
      <DashboardAnnouncements role="student" />

    </div>
  );
}
