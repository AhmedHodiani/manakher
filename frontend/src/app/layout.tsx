import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manakher",
  description: "Educational platform for schools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default lang/dir to Arabic (the default locale).
  // The [lang]/layout.tsx will override these via HtmlAttributes on the client.
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
