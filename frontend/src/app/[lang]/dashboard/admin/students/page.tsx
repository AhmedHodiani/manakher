"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import pb from "@/lib/pocketbase";
import { Users, Plus, Trash2, Pencil, Loader2, X, ChevronDown } from "lucide-react";

interface Student {
  id: string;
  name_ar: string;
  name_en: string;
  email: string;
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

const EMPTY_FORM = { name_ar: "", name_en: "", email: "", password: "", section: "" };

function SectionPicker({
  label,
  placeholder,
  value,
  options,
  getLabel,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: ClassSection[];
  getLabel: (s: ClassSection) => string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.id === value);

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm text-start focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        <span className={selected ? "text-[var(--color-ink)]" : "text-[var(--color-ink-placeholder)]"}>
          {selected ? getLabel(selected) : placeholder}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-placeholder)]" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-md)]">
          <label className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--color-surface-hover)] text-sm">
            <input type="radio" name="section-pick" value="" checked={value === ""} onChange={() => { onChange(""); setOpen(false); }} className="accent-[var(--color-accent)]" />
            <span className="text-[var(--color-ink-placeholder)]">—</span>
          </label>
          {options.map(s => (
            <label key={s.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-[var(--color-surface-hover)] text-sm">
              <input
                type="radio"
                name="section-pick"
                value={s.id}
                checked={value === s.id}
                onChange={() => { onChange(s.id); setOpen(false); }}
                className="accent-[var(--color-accent)]"
              />
              <span>{getLabel(s)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.students;
  const c = dict.common;

  const [students, setStudents] = useState<Student[]>([]);
  const [allSections, setAllSections] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

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

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(student: Student) {
    setEditingId(student.id);
    setForm({
      name_ar: student.name_ar,
      name_en: student.name_en,
      email: student.email,
      password: "",
      section: student.sections?.[0] ?? "",
    });
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
        const data: Record<string, unknown> = {
          name_ar: form.name_ar,
          name_en: form.name_en,
          email: form.email,
          sections: form.section ? [form.section] : [],
        };
        if (form.password) {
          data.password = form.password;
          data.passwordConfirm = form.password;
        }
        await pb.collection("users").update(editingId, data);
      } else {
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
      await pb.collection("users").delete(id);
      setStudents(s => s.filter(x => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const getSectionName = (s: ClassSection) =>
    locale === "ar" ? `${s.grade_ar} — ${s.section_ar}` : `${s.grade_en} — ${s.section_en}`;

  const inputCls = "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm placeholder:text-[var(--color-ink-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

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
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.nameAr}</label>
              <input required value={form.name_ar} placeholder={t.phNameAr} onChange={e => setForm(f => ({...f, name_ar: e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.nameEn}</label>
              <input required value={form.name_en} placeholder={t.phNameEn} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">{t.email}</label>
              <input required type="email" value={form.email} placeholder={t.phEmail} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputCls} dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--color-ink-secondary)]">
                {editingId ? t.newPassword : t.password}
              </label>
              <input
                type="password"
                required={!editingId}
                minLength={editingId ? 0 : 8}
                value={form.password}
                placeholder={t.phPassword}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                className={inputCls}
                dir="ltr"
              />
            </div>
            <div className="sm:col-span-2">
              <SectionPicker
                label={t.assignedSection}
                placeholder="—"
                value={form.section}
                options={allSections}
                getLabel={getSectionName}
                onChange={id => setForm(f => ({...f, section: id}))}
              />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
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
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(student)}
                    className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent-text)] transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    {c.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={deletingId === student.id}
                    className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-text)] transition-colors disabled:opacity-50"
                  >
                    {deletingId === student.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    {c.delete}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
