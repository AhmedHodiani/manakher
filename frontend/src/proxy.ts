import { NextRequest, NextResponse } from "next/server";
import type { NextProxy } from "next/server";

// Cookie name used by PocketBase JS SDK
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
    // No auth cookie, redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Try to parse the auth cookie to get role info
  try {
    const authData = JSON.parse(authCookie.value);
    const token = authData?.token;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Decode JWT payload to get role (base64 decode the middle part)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check token expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // If cookie parsing fails, redirect to login
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
