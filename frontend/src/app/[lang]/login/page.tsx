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
    <div className="flex min-h-screen bg-[var(--color-surface)]">

      {/* Left panel — decorative brand side */}
      <div
        className="hidden lg:flex lg:w-[44%] flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #5b21b6 0%, #7c3aed 50%, #4c1d95 100%)",
        }}
      >
        {/* Large soft circles — texture without chaos */}
        <div
          className="absolute rounded-full opacity-20"
          style={{ width: 440, height: 440, background: "#ffffff", top: -80, insetInlineEnd: -120 }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{ width: 280, height: 280, background: "#ffffff", bottom: 40, insetInlineStart: -60 }}
        />
        <div
          className="absolute rounded-full opacity-15"
          style={{ width: 180, height: 180, background: "#c4b5fd", bottom: 200, insetInlineEnd: 60 }}
        />

        {/* Brand content */}
        <div className="relative z-10 text-center px-12">
          {/* Brand mark — large, geometric */}
          <div
            className="inline-flex h-24 w-24 items-center justify-center rounded-[var(--radius-2xl)] mb-8 shadow-[var(--shadow-lg)]"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.25)" }}
          >
            <span className="text-4xl font-black text-white" style={{ letterSpacing: "-1px" }}>م</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.5px" }}>
            {dict.common.appName}
          </h1>
          <p className="text-violet-200 text-base leading-relaxed max-w-[260px] mx-auto">
            {t.subtitle}
          </p>

          {/* Decorative row of dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <span className="h-2 w-8 rounded-full bg-white opacity-80" />
            <span className="h-2 w-2 rounded-full bg-white opacity-40" />
            <span className="h-2 w-2 rounded-full bg-white opacity-40" />
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">

        {/* Language switcher — top right */}
        <div className="absolute top-5 end-5">
          <button
            onClick={() => switchLocale(nextLocale)}
            className="text-xs font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors rounded-[var(--radius-full)] px-3 py-1.5 hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]"
          >
            {dict.common.switchLang}
          </button>
        </div>

        {/* Mobile brand mark — only visible on small screens */}
        <div className="lg:hidden mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-accent)] mb-3 shadow-[var(--shadow-md)]">
            <span className="text-2xl font-black text-white">م</span>
          </div>
          <h1 className="text-lg font-bold text-[var(--color-ink)]">{dict.common.appName}</h1>
        </div>

        {/* Form container */}
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[var(--color-ink)]" style={{ letterSpacing: "-0.5px" }}>
              {t.title}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-ink-secondary)]">
              {t.subtitle}
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] p-8">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--color-danger-subtle)] border border-red-100 p-4 text-sm text-[var(--color-danger-text)]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                className="mt-1 w-full py-3 text-base rounded-[var(--radius-lg)]"
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
    </div>
  );
}
