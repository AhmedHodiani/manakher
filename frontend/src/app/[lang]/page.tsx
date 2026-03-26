"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getRoleDashboardPath } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function LocaleRoot() {
  const { user, isLoading } = useAuth();
  const { locale } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(getRoleDashboardPath(user.role, locale));
      } else {
        router.replace(`/${locale}/login`);
      }
    }
  }, [isLoading, user, locale, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}
