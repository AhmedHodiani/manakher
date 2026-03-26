"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getRoleDashboardPath } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function DashboardIndex() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getRoleDashboardPath(user.role));
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}
