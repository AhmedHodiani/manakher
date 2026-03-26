// Client-safe locale configuration — no "server-only" dependency.
// This can be imported in both Server and Client components.

export type Locale = "ar" | "en";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

export const hasLocale = (locale: string): locale is Locale =>
  LOCALES.includes(locale as Locale);

/** Returns "rtl" for Arabic, "ltr" for everything else */
export function getDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
