"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale-config";
import { LOCALES } from "@/lib/locale-config";

// Dictionary type is inferred from JSON — we keep it generic here to avoid
// importing from the server-only i18n.ts module.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>;

interface LocaleContextType {
  locale: Locale;
  dict: Dictionary;
  dir: "rtl" | "ltr";
  switchLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  locale,
  dict,
  dir,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  dir: "rtl" | "ltr";
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // Pathname is e.g. /ar/dashboard/admin — swap the locale segment
      const segments = pathname.split("/");
      if (LOCALES.includes(segments[1] as Locale)) {
        segments[1] = next;
      } else {
        segments.splice(1, 0, next);
      }
      router.push(segments.join("/") || "/");
    },
    [locale, pathname, router]
  );

  return (
    <LocaleContext.Provider value={{ locale, dict, dir, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
