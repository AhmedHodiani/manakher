"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getPocketBase } from "@/lib/pocketbase";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichContent } from "@/components/ui/rich-content";

interface Announcement {
  id: string;
  title: string;
  body: string;
  scope: "global" | "section";
  section: string;
  created: string;
  expand?: { 
    author?: { name_ar: string; name_en: string };
    section?: { grade_ar: string; grade_en: string; section_ar: string; section_en: string };
  };
}

interface DashboardAnnouncementsProps {
  role: "admin" | "teacher" | "student";
}

export function DashboardAnnouncements({ role }: DashboardAnnouncementsProps) {
  const { user } = useAuth();
  const { dict, locale } = useLocale();
  
  // Use existing dictionary keys where possible, or fallback
  const t = role === "admin" 
    ? { title: locale === "ar" ? "الإعلانات الأخيرة" : "Recent Announcements", empty: dict.common.noResults }
    : role === "teacher" 
      ? dict.dashboard.teacher.announcements 
      : dict.dashboard.student.announcements;

  const [list, setList] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const pb = getPocketBase();
    const sections: string[] = (user as any).sections ?? [];

    try {
      let filter = "";
      
      if (role === "admin") {
        // Admin sees all announcements
        filter = ""; 
      } else {
        // Teachers and Students see global + their sections
        filter = `scope = "global"`;
        if (sections.length > 0) {
          const secFilter = sections.map((id) => `section = "${id}"`).join(" || ");
          filter = `scope = "global" || (${secFilter})`;
        }
      }

      const items = await pb.collection("announcements").getFullList<Announcement>({
        filter,
        sort: "-created",
        expand: "author,section",
      });
      setList(items);
    } catch (e) {
      console.error("Failed to load dashboard announcements:", e);
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    load();
  }, [load]);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (!loading && list.length === 0) return null;

  const roleColors = {
    admin: { bg: "var(--color-role-admin-bg)", bold: "var(--color-role-admin-bold)" },
    teacher: { bg: "var(--color-role-teacher-bg)", bold: "var(--color-role-teacher-bold)" },
    student: { bg: "var(--color-role-student-bg)", bold: "var(--color-role-student-bold)" },
  };

  const colors = roleColors[role];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.2px" }}>
        {t.title}
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div 
            className="h-6 w-6 rounded-full border-2 border-t-transparent animate-spin" 
            style={{ borderColor: `${colors.bold} transparent ${colors.bold} ${colors.bold}` }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((ann) => {
            const isExpanded = expandedId === ann.id;
            const author = ann.expand?.author;
            const authorName = author
              ? (locale === "ar" ? author.name_ar : author.name_en)
              : null;
            const section = ann.expand?.section;
            const sectionName = section
              ? (locale === "ar" ? `${section.grade_ar} - ${section.section_ar}` : `${section.grade_en} - ${section.section_en}`)
              : null;

            return (
              <div
                key={ann.id}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-sm)]"
              >
                <button
                  onClick={() => toggle(ann.id)}
                  className="w-full flex items-start justify-between gap-3 px-5 py-4 text-start"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                      style={{
                        background: colors.bg,
                        color: colors.bold,
                      }}
                    >
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-[var(--color-ink)] leading-tight">{ann.title}</p>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                        <Badge variant={ann.scope === "global" ? "accent" : "default"}>
                          {ann.scope === "global" 
                            ? (locale === "ar" ? "عام" : "Global") 
                            : (locale === "ar" ? "للفصل" : "Section")
                          }
                        </Badge>
                        {sectionName && (
                          <span className="text-[var(--color-ink-secondary)] font-medium underline decoration-[var(--color-border)] underline-offset-2">
                             {sectionName}
                          </span>
                        )}
                        {authorName && (
                          <span className="text-[var(--color-ink-secondary)] font-medium italic">
                            {authorName}
                          </span>
                        )}
                        <span className="text-[var(--color-ink-secondary)] opacity-60">
                          {ann.created?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[var(--color-ink-secondary)] mt-1 shrink-0">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {isExpanded && ann.body && (
                  <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] px-5 py-4">
                    <RichContent html={ann.body} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
