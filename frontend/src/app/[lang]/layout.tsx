import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, getDir, type Locale } from "@/lib/locale-config";
import { LocaleProvider } from "@/context/locale-context";
import { HtmlAttributes } from "@/components/html-attributes";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dir = getDir(locale);
  const dict = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dict={dict} dir={dir}>
      {/* Update <html lang> and <html dir> on the client */}
      <HtmlAttributes locale={locale} dir={dir} />
      {children}
    </LocaleProvider>
  );
}
