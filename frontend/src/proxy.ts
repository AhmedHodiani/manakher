import { NextRequest, NextResponse } from "next/server";
import type { NextProxy } from "next/server";

const PB_AUTH_COOKIE = "pb_auth";

const publicPaths = ["/login"];

// Map dashboard path prefixes to the role that is allowed to access them
const rolePaths: Record<string, string> = {
  "/dashboard/admin": "admin",
  "/dashboard/teacher": "teacher",
  "/dashboard/student": "student",
};

function getAuthFromCookie(
  request: NextRequest
): { token: string; role: string; expired: boolean } | null {
  const authCookie = request.cookies.get(PB_AUTH_COOKIE);
  if (!authCookie?.value) return null;

  try {
    const decoded = decodeURIComponent(authCookie.value);
    const authData = JSON.parse(decoded);
    const token = authData?.token;
    const role = authData?.record?.role;

    if (!token || !role) return null;

    // Decode JWT to check expiry
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expired = payload.exp ? payload.exp * 1000 < Date.now() : false;

    return { token, role, expired };
  } catch {
    return null;
  }
}

export const proxy: NextProxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const auth = getAuthFromCookie(request);

  // Not authenticated or expired -> login
  if (!auth || auth.expired) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route enforcement
  for (const [pathPrefix, requiredRole] of Object.entries(rolePaths)) {
    if (pathname.startsWith(pathPrefix) && auth.role !== requiredRole) {
      // Redirect to the user's own dashboard
      const correctPath = `/dashboard/${auth.role}`;
      const redirectUrl = new URL(correctPath, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
