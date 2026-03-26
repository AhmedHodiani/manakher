import { NextRequest, NextResponse } from "next/server";
import type { NextProxy } from "next/server";

// Cookie name synced from PocketBase authStore (set in lib/pocketbase.ts)
const PB_AUTH_COOKIE = "pb_auth";

const publicPaths = ["/login"];

export const proxy: NextProxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for PocketBase auth cookie
  const authCookie = request.cookies.get(PB_AUTH_COOKIE);

  if (!authCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Try to parse the auth cookie to validate the token
  try {
    const decoded = decodeURIComponent(authCookie.value);
    const authData = JSON.parse(decoded);
    const token = authData?.token;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Decode JWT payload (base64url) to check expiry
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token expired
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // Cookie is malformed, redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
