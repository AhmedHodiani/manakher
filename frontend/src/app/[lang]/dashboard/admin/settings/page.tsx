"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import pb from "@/lib/pocketbase";
import { Settings, Save, Loader2, CheckCircle2 } from "lucide-react";
import { logAudit } from "@/lib/audit";

interface PlatformSettings {
  id: string;
  global_comments_enabled: boolean;
  maintenance_mode: boolean;
  school_calendar: string;
}

export default function SettingsPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.settings;
  const c = dict.common;

  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await pb.collection("settings").getFullList<PlatformSettings>();
      if (res.length > 0) {
        setSettings(res[0]);
      } else {
        // Create initial record
        const initial = await pb.collection("settings").create({
          global_comments_enabled: true,
          maintenance_mode: false,
          school_calendar: "",
        });
        setSettings(initial as unknown as PlatformSettings);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      await pb.collection("settings").update(settings.id, settings);
      await logAudit("TOGGLE_SETTINGS", settings.id, `Updated global settings: Maintenance=${settings.maintenance_mode}, Comments=${settings.global_comments_enabled}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" /></div>;
  if (!settings) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-role-admin-bg)]">
          <Settings className="h-5 w-5 text-[var(--color-role-admin-bold)]" />
        </div>
        <h2 className="text-xl font-black text-[var(--color-ink)]">{t.title}</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Maintenance Mode */}
          <div className="flex flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[var(--color-ink)]">{t.maintenanceMode}</label>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                className={[
                  "relative h-6 w-11 rounded-full transition-colors",
                  settings.maintenance_mode ? "bg-red-500" : "bg-[var(--color-border)]"
                ].join(" ")}
              >
                <div className={["absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform", settings.maintenance_mode ? "translate-x-5" : ""].join(" ")} />
              </button>
            </div>
            <p className="text-xs text-[var(--color-ink-secondary)]">{t.maintenanceDesc}</p>
          </div>

          {/* Global Comments */}
          <div className="flex flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[var(--color-ink)]">{t.globalComments}</label>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, global_comments_enabled: !settings.global_comments_enabled })}
                className={[
                  "relative h-6 w-11 rounded-full transition-colors",
                  settings.global_comments_enabled ? "bg-emerald-500" : "bg-[var(--color-border)]"
                ].join(" ")}
              >
                <div className={["absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform", settings.global_comments_enabled ? "translate-x-5" : ""].join(" ")} />
              </button>
            </div>
            <p className="text-xs text-[var(--color-ink-secondary)]">{t.globalCommentsDesc}</p>
          </div>

        </div>

        {/* Calendar Link */}
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-[var(--shadow-xs)]">
          <label className="mb-2 block text-sm font-bold text-[var(--color-ink)]">{t.calendar} (Google Calendar ID / URL)</label>
          <input
            value={settings.school_calendar}
            onChange={e => setSettings({ ...settings, school_calendar: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            dir="ltr"
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 animate-in fade-in slide-in-from-left-4 duration-500">
                <CheckCircle2 className="h-4 w-4" />
                {t.saveSuccess}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-role-admin-bold)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {c.save}
          </button>
        </div>
      </form>
    </div>
  );
}
