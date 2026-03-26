"use client";

import { useAuth } from "@/context/auth-context";
import { Shield, Users, BookOpen, Bell } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Admin Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Welcome back, {user?.name || "Administrator"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<Users className="h-5 w-5 text-slate-600" />}
          label="Total Users"
          value="--"
        />
        <DashboardCard
          icon={<BookOpen className="h-5 w-5 text-slate-600" />}
          label="Active Classes"
          value="--"
        />
        <DashboardCard
          icon={<Shield className="h-5 w-5 text-slate-600" />}
          label="Teachers"
          value="--"
        />
        <DashboardCard
          icon={<Bell className="h-5 w-5 text-slate-600" />}
          label="Announcements"
          value="--"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
