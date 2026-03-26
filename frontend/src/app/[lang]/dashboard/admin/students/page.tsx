"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import pb from "@/lib/pocketbase";
import { Users, Plus, Trash2, Loader2, X, ChevronDown } from "lucide-react";

interface Student {
  id: string;
  name_ar: string;
  name_en: string;
  email: string;
  role: string;
  sections: string[];
  expand?: {
    sections?: ClassSection[];
  };
}

interface ClassSection {
  id: string;
  grade_ar: string;
  grade_en: string;
  section_ar: string;
  section_en: string;
  grade_order: number;
}

export default function StudentsPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.students;
  const c = dict.common;

  const [students, setStudents] = useState<Student[]>([]);
  const [allSections, setAllSections] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  const [form, setForm] = useState({
    name_ar: "", name_en: "", email: "", password: "",
    section: "",  // single section id
  });

  async function load() {
    setLoading(true);
    try {
      const [studentsRes, sectionsRes] = await Promise.all([
        pb.collection("users").getFullList<Student>({
          filter: 'role = "student"',
          expand: "sections",
          sort: "name_ar",
        }),
        pb.collection("class_sections").getFullList<ClassSection>({ sort: "grade_order,section_ar" }),
      ]);
      setStudents(studentsRes);
      setAllSections(sectionsRes);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await pb.collection("users").create({
        name_ar: form.name_ar,
        name_en: form.name_en,
        email: form.email,
        password: form.password,
        passwordConfirm: form.password,
        role: "student",
        sections: form.section ? [form.section] : [],
        emailVisibility: true,
      });
      setForm({ name_ar: "", name_en: "", email: "", password: "", section: "" });
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(id);
    try {
      await pb.collection("users").delete(id);
      setStudents(s => s.filter(x => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const getSectionName = (s: ClassSection) =>
    locale === "ar" ? `${s.grade_ar} — ${s.section_ar}` : `${s.grade_en} — ${s.section_en}`;

  const selectedSectionName = form.section
    ? getSectionName(allSections.find(s => s.id === form.section) ?? allSections[0])
    : "—";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-role-admin-bg)]">
            <Users className="h-5 w-5 text-[var(--color-role-admin-bold)]" />
          </div>
          <h2 className="text-xl font-black text-[var(--color-ink)]">{t.title}</h2>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-role-admin-bold)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t.add}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-[var(--shadow-sm)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[var(--color-ink)]">{t.add}</h3>
            <button onClick={() => setShowForm(false)} className="text-[var(--color-ink-placeholder)] hover:text-[var(--color-ink)]"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.nameAr}</label>
              <input required value={form.name_ar} onChange={e => setForm(f => ({...f, name_ar: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.nameEn}</label>
              <input required value={form.name_en} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.email}</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.password}</label>
              <input required type="password" minLength={8} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" dir="ltr" />
            </div>
            {/* Section picker */}
            <div className="sm:col-span-2 relative">
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.assignedSection}</label>
              <button
                type="button"
                onClick={() => setSectionDropdownOpen(v => !v)}
                className="w-full flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm text-start focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <span className={form.section ? "text-[var(--color-ink)]" : "text-[var(--color-ink-placeholder)]"}>
                  {form.section ? selectedSectionName : "—"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-placeholder)]" />
              </button>
              {sectionDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-md)]">
                  <label className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--color-surface-hover)] text-sm">
                    <input type="radio" name="section" value="" checked={form.section === ""} onChange={() => { setForm(f => ({...f, section: ""})); setSectionDropdownOpen(false); }} className="accent-[var(--color-accent)]" />
                    <span className="text-[var(--color-ink-placeholder)]">—</span>
                  </label>
                  {allSections.map(s => (
                    <label key={s.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--color-surface-hover)] text-sm">
                      <input
                        type="radio"
                        name="section"
                        value={s.id}
                        checked={form.section === s.id}
                        onChange={() => { setForm(f => ({...f, section: s.id})); setSectionDropdownOpen(false); }}
                        className="accent-[var(--color-accent)]"
                      />
                      <span>{getSectionName(s)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-[var(--radius-full)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">{c.cancel}</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-role-admin-bold)] px-5 py-2 text-sm font-bold text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-60">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {c.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" /></div>
      ) : students.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--color-ink-disabled)]">{t.empty}</p>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)] divide-y divide-[var(--color-border-subtle)]">
          {students.map(student => {
            const expandedSections = student.expand?.sections ?? [];
            return (
              <div key={student.id} className="flex items-center justify-between px-4 py-3.5 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--color-ink)] truncate">
                    {locale === "ar" ? student.name_ar : student.name_en}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <p className="text-xs text-[var(--color-ink-secondary)] truncate">{student.email}</p>
                    {expandedSections.map(s => (
                      <span key={s.id} className="rounded-[var(--radius-full)] bg-[var(--color-role-student-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-role-student-text)]">
                        {locale === "ar" ? `${s.grade_ar} ${s.section_ar}` : `${s.grade_en} ${s.section_en}`}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(student.id)}
                  disabled={deletingId === student.id}
                  className="flex items-center gap-1.5 shrink-0 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-text)] transition-colors disabled:opacity-50"
                >
                  {deletingId === student.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  {c.delete}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
