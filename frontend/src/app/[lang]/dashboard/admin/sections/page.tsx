"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import pb from "@/lib/pocketbase";
import { Layers, Plus, Trash2, Loader2, X } from "lucide-react";

interface ClassSection {
  id: string;
  grade_ar: string;
  grade_en: string;
  grade_order: number;
  section_ar: string;
  section_en: string;
}

export default function SectionsPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.sections;
  const c = dict.common;

  const [sections, setSections] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ grade_ar: "", grade_en: "", grade_order: "", section_ar: "", section_en: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await pb.collection("class_sections").getFullList<ClassSection>({ sort: "grade_order,section_ar" });
      setSections(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await pb.collection("class_sections").create({
        grade_ar: form.grade_ar,
        grade_en: form.grade_en,
        grade_order: Number(form.grade_order),
        section_ar: form.section_ar,
        section_en: form.section_en,
      });
      setForm({ grade_ar: "", grade_en: "", grade_order: "", section_ar: "", section_en: "" });
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
      await pb.collection("class_sections").delete(id);
      setSections(s => s.filter(x => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  // Group by grade
  const byGrade = sections.reduce<Record<number, ClassSection[]>>((acc, s) => {
    const key = s.grade_order;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
  const gradeKeys = Object.keys(byGrade).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-role-admin-bg)]">
            <Layers className="h-5 w-5 text-[var(--color-role-admin-bold)]" />
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
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.gradeAr}</label>
              <input required value={form.grade_ar} onChange={e => setForm(f => ({...f, grade_ar: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.gradeEn}</label>
              <input required value={form.grade_en} onChange={e => setForm(f => ({...f, grade_en: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.gradeOrder}</label>
              <input required type="number" min={1} value={form.grade_order} onChange={e => setForm(f => ({...f, grade_order: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.sectionAr}</label>
              <input required value={form.section_ar} onChange={e => setForm(f => ({...f, section_ar: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.sectionEn}</label>
              <input required value={form.section_en} onChange={e => setForm(f => ({...f, section_en: e.target.value}))} className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" dir="ltr" />
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

      {/* Sections list */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" /></div>
      ) : sections.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--color-ink-disabled)]">{t.empty}</p>
      ) : (
        <div className="space-y-4">
          {gradeKeys.map(gk => {
            const gradeItems = byGrade[gk];
            const g = gradeItems[0];
            const gradeName = locale === "ar" ? g.grade_ar : g.grade_en;
            return (
              <div key={gk} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)]">
                <div className="px-4 py-3 bg-[var(--color-role-admin-card)] border-b border-[var(--color-border)]">
                  <span className="text-sm font-black text-[var(--color-role-admin-text)]">{gradeName}</span>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {gradeItems.map(s => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-semibold text-[var(--color-ink)]">
                        {locale === "ar" ? s.section_ar : s.section_en}
                      </span>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-text)] transition-colors disabled:opacity-50"
                      >
                        {deletingId === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        {c.delete}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
