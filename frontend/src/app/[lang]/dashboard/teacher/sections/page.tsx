"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getDisplayName } from "@/lib/auth";
import { getPocketBase } from "@/lib/pocketbase";
import { Users } from "lucide-react";

interface Section {
  id: string;
  grade_ar: string;
  grade_en: string;
  grade_order: number;
  section_ar: string;
  section_en: string;
}

interface Student {
  id: string;
  name_ar: string;
  name_en: string;
  email: string;
}

interface SectionWithStudents {
  section: Section;
  students: Student[];
}

export default function TeacherSectionsPage() {
  const { user } = useAuth();
  const { dict, locale } = useLocale();
  const t = dict.dashboard.teacher;

  const [data, setData] = useState<SectionWithStudents[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const pb = getPocketBase();
    const sectionIds: string[] = (user as any).sections ?? [];

    if (sectionIds.length === 0) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const pb = getPocketBase();
        // Fetch all assigned sections
        const sectionFilter = sectionIds.map((id) => `id = "${id}"`).join(" || ");
        const sections = await pb
          .collection("class_sections")
          .getFullList<Section>({ filter: sectionFilter, sort: "grade_order,section_ar" });

        // Fetch students per section
        const results: SectionWithStudents[] = await Promise.all(
          sections.map(async (sec) => {
            const students = await pb
              .collection("users")
              .getFullList<Student>({
                filter: `role = "student" && sections.id = "${sec.id}"`,
                sort: locale === "ar" ? "name_ar" : "name_en",
              });
            return { section: sec, students };
          })
        );

        setData(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, locale]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--color-role-teacher-bold)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.5px" }}>
        {t.sections.title}
      </h2>

      {data.length === 0 ? (
        <p className="text-[var(--color-ink-secondary)] text-sm">{t.sections.empty}</p>
      ) : (
        data.map(({ section, students }) => {
          const sectionName =
            locale === "ar"
              ? `${section.grade_ar} — ${section.section_ar}`
              : `${section.grade_en} — ${section.section_en}`;
          const isOpen = expanded.has(section.id);

          return (
            <div
              key={section.id}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)]"
            >
              {/* Section header */}
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-start hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-role-teacher-bold)]"
                    style={{ background: "var(--color-role-teacher-bg)" }}
                  >
                    <Users className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-[var(--color-ink)]">{sectionName}</span>
                  <span className="text-xs font-semibold text-[var(--color-ink-secondary)] bg-[var(--color-surface-sunken)] rounded-full px-2 py-0.5">
                    {students.length} {t.sections.students}
                  </span>
                </div>
                <span className="text-[var(--color-ink-secondary)] text-xs font-bold">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Students list */}
              {isOpen && (
                <div className="border-t border-[var(--color-border-subtle)]">
                  {students.length === 0 ? (
                    <p className="px-5 py-3 text-sm text-[var(--color-ink-disabled)]">
                      {t.sections.noStudents}
                    </p>
                  ) : (
                    <ul className="divide-y divide-[var(--color-border-subtle)]">
                      {students.map((s) => (
                        <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-sunken)] text-xs font-bold text-[var(--color-ink-secondary)]">
                            {(locale === "ar" ? s.name_ar : s.name_en).charAt(0)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-ink)]">
                              {getDisplayName(s as any, locale)}
                            </p>
                            <p className="text-xs text-[var(--color-ink-secondary)]">{s.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
