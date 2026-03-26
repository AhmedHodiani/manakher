import "server-only";

// Re-export client-safe config for convenience in server components
export { type Locale, LOCALES, DEFAULT_LOCALE, hasLocale, getDir } from "./locale-config";

const dictionaries = {
  ar: () =>
    import("../dictionaries/ar.json").then((module) => module.default),
  en: () =>
    import("../dictionaries/en.json").then((module) => module.default),
};

export type Dictionary = Awaited<
  ReturnType<(typeof dictionaries)[keyof typeof dictionaries]>
>;

export const getDictionary = async (locale: import("./locale-config").Locale) =>
  dictionaries[locale]();
