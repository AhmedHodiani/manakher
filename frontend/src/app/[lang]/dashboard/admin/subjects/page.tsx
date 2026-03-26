"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import pb from "@/lib/pocketbase";
import { BookOpen, Plus, Trash2, Pencil, Loader2, X } from "lucide-react";

interface Subject {
  id: string;
  name_ar: string;
  name_en: string;
  code: string;
}

const EMPTY_FORM = { name_ar: "", name_en: "", code: "" };

export default function SubjectsPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.subjects;
  const c = dict.common;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function load() {
    setLoading(true);
    try {
      const res = await pb.collection("subjects").getFullList<Subject>({ sort: "name_ar" });
      setSubjects(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(s: Subject) {
    setEditingId(s.id);
    setForm({ name_ar: s.name_ar, name_en: s.name_en, code: s.code });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await pb.collection("subjects").update(editingId, form);
      } else {
        await pb.collection("subjects").create(form);
      }
      closeForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(id);
    try {
      await pb.collection("subjects").delete(id);
      setSubjects(s => s.filter(x => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const inputCls = "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm placeholder:text-[var(--color-ink-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-role-admin-bg)]">
            <BookOpen className="h-5 w-5 text-[var(--color-role-admin-bold)]" />
          </div>
          <h2 className="text-xl font-black text-[var(--color-ink)]">{t.title}</h2>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-role-admin-bold)] px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t.add}
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-[var(--shadow-sm)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[var(--color-ink)]">{editingId ? t.editTitle : t.add}</h3>
            <button onClick={closeForm} className="text-[var(--color-ink-placeholder)] hover:text-[var(--color-ink)]"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.nameAr}</label>
              <input required value={form.name_ar} placeholder={t.phNameAr} onChange={e => setForm(f => ({...f, name_ar: e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.nameEn}</label>
              <input required value={form.name_en} placeholder={t.phNameEn} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.code}</label>
              <input required value={form.code} placeholder={t.phCode} onChange={e => setForm(f => ({...f, code: e.target.value}))} className={inputCls} dir="ltr" />
            </div>
            <div className="sm:col-span-3 flex gap-2 justify-end pt-1">
              <button type="button" onClick={closeForm} className="rounded-[var(--radius-full)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">{c.cancel}</button>
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
      ) : subjects.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--color-ink-disabled)]">{t.empty}</p>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)] divide-y divide-[var(--color-border-subtle)]">
          {subjects.map(s => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-bold text-[var(--color-ink)]">{locale === "ar" ? s.name_ar : s.name_en}</p>
                <p className="text-xs text-[var(--color-ink-secondary)]">
                  {locale === "ar" ? s.name_en : s.name_ar}
                  {" · "}
                  <span className="font-mono">{s.code}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(s)}
                  className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-text)] transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  {c.edit}
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-text)] transition-colors disabled:opacity-50"
                >
                  {deletingId === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  {c.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
