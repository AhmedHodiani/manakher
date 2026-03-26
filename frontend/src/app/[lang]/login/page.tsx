"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getRoleDashboardPath } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { dict, locale, switchLocale } = useLocale();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      router.push(getRoleDashboardPath(user.role, locale));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : dict.login.invalidCredentials
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const t = dict.login;
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4">
      <div className="w-full max-w-[380px]">

        {/* Language switcher */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => switchLocale(nextLocale)}
            className="text-xs font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors rounded-[var(--radius-md)] px-2.5 py-1 hover:bg-[var(--color-surface-hover)]"
          >
            {dict.common.switchLang}
          </button>
        </div>

        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent)] mb-4">
            <span className="text-xl font-bold text-white">م</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-ink)]">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">
            {t.subtitle}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] p-6">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-[var(--radius-md)] bg-[var(--color-danger-subtle)] border border-[var(--color-danger-subtle)] p-3 text-sm text-[var(--color-danger-text)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label={t.emailLabel}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder={t.emailPlaceholder}
            />

            <Input
              id="password"
              label={t.passwordLabel}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder={t.passwordPlaceholder}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-2.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isSubmitting ? t.submittingButton : t.submitButton}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
