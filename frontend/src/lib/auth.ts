import pb from "./pocketbase";
import type { RecordModel } from "pocketbase";

export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser extends RecordModel {
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  verified: boolean;
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  const authData = await pb
    .collection("users")
    .authWithPassword(email, password);

  // The cookie is set by the onChange listener in pocketbase.ts,
  // but we also set it here explicitly to guarantee it exists
  // before the router navigates away.
  if (typeof document !== "undefined") {
    const cookieValue = JSON.stringify({
      token: pb.authStore.token,
      record: pb.authStore.record,
    });
    document.cookie = `pb_auth=${encodeURIComponent(cookieValue)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }

  return authData.record as unknown as AuthUser;
}

export function logout(): void {
  pb.authStore.clear();
  if (typeof document !== "undefined") {
    document.cookie = "pb_auth=; path=/; max-age=0; SameSite=Lax";
  }
}

export function getCurrentUser(): AuthUser | null {
  if (!pb.authStore.isValid) {
    return null;
  }
  return pb.authStore.record as unknown as AuthUser | null;
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export function getUserRole(): UserRole | null {
  const user = getCurrentUser();
  return user?.role ?? null;
}

export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    default:
      return "/login";
  }
}
