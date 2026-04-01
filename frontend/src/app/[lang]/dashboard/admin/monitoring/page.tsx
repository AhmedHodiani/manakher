"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import { getPocketBase } from "@/lib/pocketbase";
import {
  Users, GraduationCap, Layers, BookOpen, FileText,
  Megaphone, ClipboardList, ListChecks, MessageCircle,
  Heart, TrendingUp, Activity
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

interface SystemMetrics {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalSections: number;
  totalSubjects: number;
  totalMaterials: number;
  totalAnnouncements: number;
  totalHomework: number;
  totalQuizzes: number;
  totalSubmissions: number;
  totalComments: number;
  totalReactions: number;
  avgQuizScore: number;
}

export default function MonitoringPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.monitoring;
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    const pb = getPocketBase();
    try {
      // Fetch all counts in parallel
      const [
        users,
        teachers,
        students,
        sections,
        subjects,
        materials,
        announcements,
        homework,
        quizzes,
        submissions,
        comments,
        reactions,
        attempts,
      ] = await Promise.all([
        pb.collection("users").getList(1, 1),
        pb.collection("users").getList(1, 1, { filter: 'role = "teacher"' }),
        pb.collection("users").getList(1, 1, { filter: 'role = "student"' }),
        pb.collection("class_sections").getList(1, 1),
        pb.collection("subjects").getList(1, 1),
        pb.collection("materials").getList(1, 1),
        pb.collection("announcements").getList(1, 1),
        pb.collection("homework").getList(1, 1),
        pb.collection("quizzes").getList(1, 1),
        pb.collection("submissions").getList(1, 1),
        pb.collection("comments").getList(1, 1),
        pb.collection("reactions").getList(1, 1),
        pb.collection("quiz_attempts").getList(1, 500), // Get attempts for avg score
      ]);

      // Calculate average quiz score
      let avgScore = 0;
      if (attempts.items.length > 0) {
        const totalScore = attempts.items.reduce(
          (sum, att: any) =>
            sum + (att.total_questions > 0 ? (att.score / att.total_questions) * 100 : 0),
          0
        );
        avgScore = Math.round(totalScore / attempts.items.length);
      }

      setMetrics({
        totalUsers: users.totalItems,
        totalTeachers: teachers.totalItems,
        totalStudents: students.totalItems,
        totalSections: sections.totalItems,
        totalSubjects: subjects.totalItems,
        totalMaterials: materials.totalItems,
        totalAnnouncements: announcements.totalItems,
        totalHomework: homework.totalItems,
        totalQuizzes: quizzes.totalItems,
        totalSubmissions: submissions.totalItems,
        totalComments: comments.totalItems,
        totalReactions: reactions.totalItems,
        avgQuizScore: avgScore,
      });
    } catch (e) {
      console.error("Failed to load metrics:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--color-role-admin-bold)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-ink-secondary)]">
          {locale === "ar" ? "فشل في تحميل البيانات" : "Failed to load data"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.5px" }}>
          {t.title}
        </h2>
        <p className="text-sm text-[var(--color-ink-secondary)] mt-1">{t.subtitle}</p>
      </div>

      {/* Users Section */}
      <div>
        <h3 className="text-lg font-bold text-[var(--color-ink)] mb-3">{t.users}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stat-card-group">
          <StatCard icon={<Users />} label={t.totalUsers} value={metrics.totalUsers} />
          <StatCard icon={<GraduationCap />} label={t.totalTeachers} value={metrics.totalTeachers} />
          <StatCard icon={<Users />} label={t.totalStudents} value={metrics.totalStudents} />
          <StatCard icon={<Layers />} label={t.totalSections} value={metrics.totalSections} />
        </div>
      </div>

      {/* Content Section */}
      <div>
        <h3 className="text-lg font-bold text-[var(--color-ink)] mb-3">{t.content}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stat-card-group">
          <StatCard icon={<BookOpen />} label={t.totalSubjects} value={metrics.totalSubjects} />
          <StatCard icon={<FileText />} label={t.totalMaterials} value={metrics.totalMaterials} />
          <StatCard icon={<Megaphone />} label={t.totalAnnouncements} value={metrics.totalAnnouncements} />
          <StatCard icon={<ClipboardList />} label={t.totalHomework} value={metrics.totalHomework} />
        </div>
      </div>

      {/* Assessment Section */}
      <div>
        <h3 className="text-lg font-bold text-[var(--color-ink)] mb-3">
          {locale === "ar" ? "التقييمات" : "Assessments"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stat-card-group">
          <StatCard icon={<ListChecks />} label={t.totalQuizzes} value={metrics.totalQuizzes} />
          <StatCard icon={<FileText />} label={t.totalSubmissions} value={metrics.totalSubmissions} />
          <StatCard
            icon={<TrendingUp />}
            label={t.avgQuizScore}
            value={metrics.avgQuizScore > 0 ? `${metrics.avgQuizScore}%` : "—"}
          />
        </div>
      </div>

      {/* Engagement Section */}
      <div>
        <h3 className="text-lg font-bold text-[var(--color-ink)] mb-3">{t.engagement}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stat-card-group">
          <StatCard icon={<MessageCircle />} label={t.totalComments} value={metrics.totalComments} />
          <StatCard icon={<Heart />} label={t.totalReactions} value={metrics.totalReactions} />
          <StatCard
            icon={<Activity />}
            label={locale === "ar" ? "النشاط الإجمالي" : "Total Activity"}
            value={metrics.totalComments + metrics.totalReactions}
          />
        </div>
      </div>
    </div>
  );
}
