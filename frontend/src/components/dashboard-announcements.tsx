"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getPocketBase } from "@/lib/pocketbase";
import { Bell, ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichContent } from "@/components/ui/rich-content";

interface Announcement {
  id: string;
  title: string;
  body: string;
  scope: "global" | "section";
  section: string;
  created: string;
  author: string;
  expand?: { 
    author?: { name_ar: string; name_en: string };
    section?: { grade_ar: string; grade_en: string; section_ar: string; section_en: string };
  };
}

interface Section {
  id: string;
  grade_ar: string;
  grade_en: string;
  section_ar: string;
  section_en: string;
}

interface DashboardAnnouncementsProps {
  role: "admin" | "teacher" | "student";
}

const EMPTY_FORM = { title: "", body: "", scope: "global" as "global" | "section", section: "" };

export function DashboardAnnouncements({ role }: DashboardAnnouncementsProps) {
  const { user } = useAuth();
  const { dict, locale } = useLocale();
  
  const t = role === "admin" 
    ? { 
        title: locale === "ar" ? "الإعلانات" : "Announcements", 
        add: locale === "ar" ? "إضافة إعلان" : "Add Announcement",
        empty: locale === "ar" ? "لا توجد إعلانات بعد." : "No announcements yet."
      }
    : role === "teacher" 
      ? dict.dashboard.teacher.announcements 
      : dict.dashboard.student.announcements;

  const c = dict.common;

  const [list, setList] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Management state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sections, setSections] = useState<Section[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const pb = getPocketBase();
    const userSections: string[] = (user as any).sections ?? [];

    try {
      let filter = "";
      
      if (role === "admin") {
        filter = ""; 
      } else {
        filter = `scope = "global"`;
        if (userSections.length > 0) {
          const secFilter = userSections.map((id) => `section = "${id}"`).join(" || ");
          filter = `scope = "global" || (${secFilter})`;
        }
      }

      const items = await pb.collection("announcements").getFullList<Announcement>({
        filter,
        sort: "-created",
        expand: "author,section",
      });
      setList(items);

      // Load sections for selection if admin/teacher
      if (role === "admin") {
        const secs = await pb.collection("class_sections").getFullList<Section>({ sort: "grade_order,section_ar" });
        setSections(secs);
      } else if (role === "teacher" && userSections.length > 0) {
        const secs = await pb.collection("class_sections").getFullList<Section>({ 
          filter: userSections.map(id => `id = "${id}"`).join(" || ") 
        });
        setSections(secs);
      }
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const pb = getPocketBase();
    try {
      const data = {
        title: form.title,
        body: form.body,
        scope: form.scope as "global" | "section",
        section: form.scope === ("section" as string) ? form.section : "",
        author: user.id,
      };

      if (editingId) {
        await pb.collection("announcements").update(editingId, data);
      } else {
        await pb.collection("announcements").create(data);
      }
      
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      await load();
    } catch (e) {
      console.error("Failed to save announcement:", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا الإعلان؟" : "Are you sure you want to delete this announcement?")) return;
    setDeletingId(id);
    const pb = getPocketBase();
    try {
      await pb.collection("announcements").delete(id);
      setList(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error("Failed to delete announcement:", e);
    } finally {
      setDeletingId(null);
    }
  }

  function openEdit(e: React.MouseEvent, ann: Announcement) {
    e.stopPropagation();
    setEditingId(ann.id);
    setForm({
      title: ann.title,
      body: ann.body,
      scope: ann.scope as "global" | "section",
      section: ann.section || "",
    });
    setShowForm(true);
  }

  const roleColors = {
    admin: { bg: "var(--color-role-admin-bg)", bold: "var(--color-role-admin-bold)", light: "var(--color-role-admin-light)" },
    teacher: { bg: "var(--color-role-teacher-bg)", bold: "var(--color-role-teacher-bold)", light: "var(--color-role-teacher-light)" },
    student: { bg: "var(--color-role-student-bg)", bold: "var(--color-role-student-bold)", light: "var(--color-role-student-light)" },
  };

  const colors = roleColors[role];
  const canManage = role === "admin" || role === "teacher";

  const inputCls = "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm placeholder:text-[var(--color-ink-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.2px" }}>
          {t.title}
        </h3>
        {canManage && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 rounded-[var(--radius-full)] px-4 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-sm)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: colors.bold }}
          >
            <Plus className="h-3.5 w-3.5" />
            {t.add}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-[var(--shadow-sm)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-bold text-[var(--color-ink)] text-sm">
              {editingId ? (locale === "ar" ? "تعديل الإعلان" : "Edit Announcement") : t.add}
            </h4>
            <button onClick={() => setShowForm(false)} className="text-[var(--color-ink-placeholder)] hover:text-[var(--color-ink)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{locale === "ar" ? "العنوان" : "Title"}</label>
              <input 
                required 
                value={form.title} 
                onChange={e => setForm(f => ({...f, title: e.target.value}))} 
                className={inputCls} 
                placeholder={locale === "ar" ? "عنوان الإعلان..." : "Announcement title..."}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{locale === "ar" ? "المحتوى" : "Content"}</label>
              <textarea 
                required 
                value={form.body} 
                onChange={e => setForm(f => ({...f, body: e.target.value}))} 
                className={inputCls + " min-h-[100px] resize-none"} 
                placeholder={locale === "ar" ? "اكتب تفاصيل الإعلان هنا..." : "Write announcement details here..."}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{locale === "ar" ? "النطاق" : "Scope"}</label>
                <select 
                  value={form.scope} 
                  onChange={e => setForm(f => ({...f, scope: e.target.value as any}))} 
                  className={inputCls}
                >
                  <option value="global">{locale === "ar" ? "عام (الجميع)" : "Global (All)"}</option>
                  <option value="section">{locale === "ar" ? "فصل محدد" : "Specific Section"}</option>
                </select>
              </div>
              {(form.scope as string) === "section" && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{locale === "ar" ? "الفصل" : "Section"}</label>
                  <select 
                    required 
                    value={form.section} 
                    onChange={e => setForm(f => ({...f, section: e.target.value}))} 
                    className={inputCls}
                  >
                    <option value="">{locale === "ar" ? "اختر الفصل..." : "Select section..."}</option>
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>
                        {locale === "ar" ? `${s.grade_ar} - ${s.section_ar}` : `${s.grade_en} - ${s.section_en}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-[var(--radius-full)] px-4 py-2 text-xs font-semibold text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
                {c.cancel}
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                className="flex items-center gap-2 rounded-[var(--radius-full)] px-5 py-2 text-xs font-bold text-white transition-all disabled:opacity-60"
                style={{ background: colors.bold }}
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {c.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div 
            className="h-6 w-6 rounded-full border-2 border-t-transparent animate-spin" 
            style={{ borderColor: `${colors.bold} transparent ${colors.bold} ${colors.bold}` }}
          />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-sunken)]/30">
          <Bell className="h-8 w-8 text-[var(--color-ink-disabled)] mb-3 opacity-20" />
          <p className="text-sm text-[var(--color-ink-disabled)] font-medium">{t.empty}</p>
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
            
            const isAuthor = user?.id === ann.author;
            const canEdit = role === "admin" || (role === "teacher" && isAuthor);

            return (
              <div
                key={ann.id}
                className="group rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-sm)]"
              >
                <div 
                  onClick={() => toggle(ann.id)}
                  className="w-full flex items-start justify-between gap-3 px-5 py-4 text-start cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)]/30"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] shadow-inner transition-transform group-hover:scale-110"
                      style={{
                        background: colors.bg,
                        color: colors.bold,
                      }}
                    >
                      <Bell className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-black text-[var(--color-ink)] leading-tight text-sm sm:text-base">{ann.title}</p>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                        <Badge variant={ann.scope === "global" ? "accent" : "default"}>
                          {ann.scope === "global" 
                            ? (locale === "ar" ? "عام" : "Global") 
                            : (locale === "ar" ? "للفصل" : "Section")
                          }
                        </Badge>
                        {sectionName && (
                          <span className="text-[var(--color-ink-secondary)] font-bold text-[10px] uppercase tracking-wider">
                             • {sectionName}
                          </span>
                        )}
                        {authorName && (
                          <span className="text-[var(--color-ink-secondary)] font-medium opacity-80">
                            • {authorName}
                          </span>
                        )}
                        <span className="text-[var(--color-ink-disabled)] font-medium">
                          • {ann.created?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    {canEdit && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => openEdit(e, ann)} 
                          className="p-1.5 rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-ink-placeholder)] hover:text-[var(--color-accent-text)] transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, ann.id)} 
                          disabled={deletingId === ann.id}
                          className="p-1.5 rounded-full hover:bg-[var(--color-danger-subtle)] text-[var(--color-ink-placeholder)] hover:text-[var(--color-danger-text)] transition-colors disabled:opacity-50"
                        >
                          {deletingId === ann.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    )}
                    <span className="text-[var(--color-ink-secondary)] shrink-0">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </div>
                </div>

                {isExpanded && ann.body && (
                  <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)]/40 px-5 py-5 pb-6">
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
