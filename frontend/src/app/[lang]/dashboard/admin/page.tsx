"use client";

import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { StatCard } from "@/components/ui/stat-card";
import { getDisplayName } from "@/lib/auth";
import { Shield, Users, BookOpen, Bell } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin;
  const displayName = user ? getDisplayName(user, locale) : "";

  return (
    <div className="space-y-8">

      {/* ── Welcome banner ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-[var(--radius-2xl)] p-7 shadow-[var(--shadow-md)]"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 60%, #7c3aed 100%)" }}
      >
        {/* Decorative circle */}
        <div className="absolute rounded-full opacity-10" style={{ width: 260, height: 260, background: "#fff", top: -80, insetInlineEnd: -60 }} />
        <div className="absolute rounded-full opacity-[0.07]" style={{ width: 140, height: 140, background: "#fff", bottom: -40, insetInlineStart: 40 }} />

        <div className="relative z-10">
          <p className="text-violet-300 text-sm font-semibold mb-1">
            {dict.dashboard.greeting} {displayName}
          </p>
          <h2 className="text-white text-2xl font-black" style={{ letterSpacing: "-0.5px" }}>
            {t.title}
          </h2>
          <p className="text-violet-200 text-xs mt-2 font-medium opacity-80">
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
          <StatCard icon={<Users />} label={t.stats.users} value="—" />
          <StatCard icon={<BookOpen />} label={t.stats.classes} value="—" />
          <StatCard icon={<Shield />} label={t.stats.teachers} value="—" />
          <StatCard icon={<Bell />} label={t.stats.announcements} value="—" />
        </div>
      </div>

    </div>
  );
}
