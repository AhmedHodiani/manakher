"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/locale-context";
import pb from "@/lib/pocketbase";
import { ShieldCheck, Eye, EyeOff, Trash2, Loader2, BookOpen, MessageSquare, ClipboardList } from "lucide-react";
import { logAudit } from "@/lib/audit";

type ContentType = "materials" | "homework" | "announcements";

interface ContentItem {
  id: string;
  title: string;
  hidden: boolean;
  type: ContentType;
  created: string;
  expand?: {
    teacher?: { name_ar: string; name_en: string };
    author?: { name_ar: string; name_en: string };
  };
}

export default function ModerationPage() {
  const { dict, locale } = useLocale();
  const t = dict.dashboard.admin.moderation;
  const c = dict.common;

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType>("materials");

  async function load() {
    setLoading(true);
    try {
      const collection = activeTab;
      const res = await pb.collection(collection).getFullList<any>({
        sort: "-created",
        expand: activeTab === "announcements" ? "author" : "teacher",
      });
      
      setItems(res.map(item => ({
        id: item.id,
        title: item.title,
        hidden: !!item.hidden,
        type: activeTab,
        created: item.created,
        expand: item.expand,
      })));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [activeTab]);

  async function handleToggleHide(item: ContentItem) {
    const newHidden = !item.hidden;
    setTogglingId(item.id);
    try {
      await pb.collection(item.type).update(item.id, { hidden: newHidden });
      await logAudit(
        "HIDE_CONTENT",
        item.id,
        `${newHidden ? "Hid" : "Showed"} ${item.type}: ${item.title}`
      );
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, hidden: newHidden } : i));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(item: ContentItem) {
    if (!confirm(t.confirmDelete)) return;
    setDeletingId(item.id);
    try {
      await pb.collection(item.type).delete(item.id);
      await logAudit("DELETE_CONTENT", item.id, `Deleted ${item.type}: ${item.title}`);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } finally {
      setDeletingId(null);
    }
  }

  const tabs = [
    { id: "materials", label: t.allMaterials, icon: BookOpen },
    { id: "homework", label: t.allHomework, icon: ClipboardList },
    { id: "announcements", label: t.allAnnouncements, icon: MessageSquare },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-role-admin-bg)]">
          <ShieldCheck className="h-5 w-5 text-[var(--color-role-admin-bold)]" />
        </div>
        <h2 className="text-xl font-black text-[var(--color-ink)]">{t.title}</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border-subtle)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2",
              activeTab === tab.id 
                ? "border-[var(--color-accent)] text-[var(--color-accent)]" 
                : "border-transparent text-[var(--color-ink-placeholder)] hover:text-[var(--color-ink)]"
            ].join(" ")}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" /></div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--color-ink-disabled)]">{c.noResults}</p>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shadow-[var(--shadow-xs)] divide-y divide-[var(--color-border-subtle)]">
          {items.map(item => {
            const author = item.expand?.teacher || item.expand?.author;
            return (
              <div key={item.id} className={["px-4 py-4 transition-colors", item.hidden ? "bg-[var(--color-surface-sunken)] opacity-70" : ""].join(" ")}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--color-ink)] truncate">{item.title}</p>
                    <p className="text-xs text-[var(--color-ink-placeholder)] mt-0.5">
                      {t.author}: {author ? (locale === "ar" ? author.name_ar : author.name_en) : "—"} • {new Date(item.created).toLocaleDateString(locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleHide(item)}
                      disabled={togglingId === item.id}
                      title={item.hidden ? t.unhide : t.hide}
                      className={[
                        "flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                        item.hidden 
                          ? "text-emerald-600 hover:bg-emerald-50" 
                          : "text-amber-600 hover:bg-amber-50"
                      ].join(" ")}
                    >
                      {togglingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                        item.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />
                      )}
                      {item.hidden ? t.unhide : t.hide}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-placeholder)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-text)] transition-colors disabled:opacity-50"
                    >
                      {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      {c.delete}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
