# Project Milestones & Iteration Journal

This document is the SINGLE SOURCE OF TRUTH for project progress. 
It contains a short and clear to-do list of milestones.

**Available Statuses:** `PLANNING` | `INPROGRESS` | `NOT_STARTED` | `HANDOFF` | `NOT_STARTED`

---

### [INPROGRESS] Milestone 1: Core Setup & Authentication
- Set up Next.js frontend and PocketBase backend.
- Implement user authentication.
- Structure Admin, Teacher, and Student roles with basic permissions.

#### Iteration Log

**Iteration 1** (2026-03-26):
- **What was done:**
  - Initialized Next.js 16.2.1 frontend (`/frontend`) with TypeScript, Tailwind CSS, App Router, `src/` dir.
  - Downloaded and set up PocketBase v0.25.9 binary (`/backend`).
  - Created PocketBase superadmin (`admin@manakher.com` / `Admin@12345`).
  - Updated the default `users` auth collection with a `role` select field (values: `admin`, `teacher`, `student`). Set required=true, presentable=true.
  - Configured API rules on `users` collection for role-based access (admins can list/create/delete all users, users can view/update themselves).
  - Installed `pocketbase` JS SDK and `lucide-react` icons in frontend.
  - Created PB client utility (`src/lib/pocketbase.ts`), auth helper functions (`src/lib/auth.ts`).
  - Created `AuthProvider` context (`src/context/auth-context.tsx`) wrapping the app.
  - Built clean login page at `/login` with email/password form, error display, loading state.
  - Created `proxy.ts` (Next.js 16 replacement for `middleware.ts`) for route protection -- checks PB auth cookie, validates JWT expiry, redirects unauthenticated users to `/login`.
  - Created dashboard layout with header (shows role badge, user name, sign out button).
  - Created placeholder dashboard pages for `/dashboard/admin`, `/dashboard/teacher`, `/dashboard/student`.
  - Root `/` page auto-redirects to role-specific dashboard or login.
  - Seeded 3 test users: `admin@school.edu`, `teacher@school.edu`, `student@school.edu` (all passwords: `Role@12345` pattern).
  - Build passes cleanly with zero errors.
- **Issues/Lessons:**
  - PocketBase MCP credentials were stale from a previous config (`admin@admin.com`). Had to update `opencode.json` with the new superadmin creds. The MCP server may still use cached old creds until restarted -- worked around by using `curl` API calls directly.
  - Next.js 16 renamed `middleware.ts` to `proxy.ts` with `export const proxy` instead of `export function middleware`. Caught this by reading the bundled docs at `node_modules/next/dist/docs/`.
  - `params` and `searchParams` are now async Promises in Next.js 16 -- must be awaited.

**Iteration 2** (2026-03-26) -- bugfix:
- **What was done:**
  - Fixed login redirect not working (test cases 6, 7, 8). Root cause: PocketBase JS SDK stores auth in `localStorage` by default, which is invisible to the server-side proxy. The proxy checked for a `pb_auth` cookie that never existed, so it blocked every navigation to `/dashboard/*` and redirected back to `/login`.
  - Added cookie sync in `pocketbase.ts` -- on every auth change, the token+record are written to a `pb_auth` cookie (URL-encoded JSON, 7-day max-age, SameSite=Lax).
  - Also set the cookie explicitly in `auth.ts login()` to guarantee it exists before `router.push()` fires.
  - Updated `proxy.ts` to `decodeURIComponent` the cookie before parsing.
  - `logout()` now explicitly clears the `pb_auth` cookie.
- **Issues/Lessons:**
  - PocketBase SDK `authStore` uses `localStorage` -- server-side code (proxy/middleware) cannot see it. Always bridge with a cookie if you need server-side auth checks.
  - The `onChange` listener in `pocketbase.ts` fires async relative to the `login()` call. Setting the cookie both in `onChange` AND directly in `login()` ensures no race condition with `router.push()`.

**Iteration 3** (2026-03-26) -- bugfix:
- **What was done:**
  - Fixed critical role-based access control gap. Previously any logged-in user could visit any dashboard (student could visit `/dashboard/admin`, etc.).
  - **proxy.ts**: Added role enforcement -- reads the `role` from the cookie's record, checks it against the dashboard path prefix. If a student tries `/dashboard/admin`, they get redirected to `/dashboard/student`.
  - **dashboard layout.tsx**: Added client-side role guard as a second layer. Checks `pathname` against `getRoleDashboardPath(user.role)`. If mismatched, redirects to the correct dashboard and does NOT render children (shows spinner instead, preventing any flash of unauthorized content).
- **Issues/Lessons:**
  - Never rely on a single layer for authorization. The proxy handles server-side requests, but client-side navigations (via `router.push` or `<Link>`) can sometimes bypass it. The layout guard catches those.
  - The role is stored inside the cookie's `record.role` field, which the proxy can read without a DB call.

#### Test Cases (for user verification)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | **PocketBase running** | Run `./pocketbase serve` from `/backend` | API healthy at `http://127.0.0.1:8090/api/health` |
| 2 | **Frontend starts** | Run `npm run dev` from `/frontend` | App loads at `http://localhost:3000` |
| 3 | **Unauthenticated redirect** | Open `http://localhost:3000` without logging in | Redirected to `/login` |
| 4 | **Protected route guard** | Navigate directly to `/dashboard/admin` without logging in | Redirected to `/login` |
| 5 | **Login with wrong credentials** | On `/login`, enter `wrong@email.com` / `badpass` and submit | Error message appears: "Invalid email or password" (or similar) |
| 6 | **Login as admin** | On `/login`, enter `admin@school.edu` / `Admin@12345` | Redirected to `/dashboard/admin`, header shows "School Admin" and role badge "admin" |
| 7 | **Login as teacher** | On `/login`, enter `teacher@school.edu` / `Teacher@12345` | Redirected to `/dashboard/teacher`, header shows "Test Teacher" and role badge "teacher" |
| 8 | **Login as student** | On `/login`, enter `student@school.edu` / `Student@12345` | Redirected to `/dashboard/student`, header shows "Test Student" and role badge "student" |
| 9 | **Sign out** | Click "Sign out" button in dashboard header | Redirected back to `/login`, session cleared |
| 10 | **Session persistence** | Log in, close the tab, open `http://localhost:3000` again | Auto-redirected to the correct role dashboard (not back to login) |
| 11 | **PocketBase admin panel** | Open `http://127.0.0.1:8090/_/` in browser | PocketBase admin UI loads, can login with `admin@manakher.com` / `Admin@12345` |
| 12 | **Users visible in PB admin** | In PB admin panel, go to `users` collection | All 3 seeded users visible with correct roles |
| 13 | **Student cannot access admin dashboard** | Log in as student, manually navigate to `/dashboard/admin` | Redirected to `/dashboard/student` |
| 14 | **Student cannot access teacher dashboard** | Log in as student, manually navigate to `/dashboard/teacher` | Redirected to `/dashboard/student` |
| 15 | **Teacher cannot access admin dashboard** | Log in as teacher, manually navigate to `/dashboard/admin` | Redirected to `/dashboard/teacher` |
| 16 | **Teacher cannot access student dashboard** | Log in as teacher, manually navigate to `/dashboard/student` | Redirected to `/dashboard/teacher` |
| 17 | **Admin cannot access teacher dashboard** | Log in as admin, manually navigate to `/dashboard/teacher` | Redirected to `/dashboard/admin` |
| 18 | **Admin cannot access student dashboard** | Log in as admin, manually navigate to `/dashboard/student` | Redirected to `/dashboard/admin` |

### [HANDOFF] Milestone 2: support 2 languanges arabic and english & RTL Architecture (Arabic First)
- **Internationalization (i18n) Setup**: Configure the Next.js foundation for seamless switching between Arabic (Default/Primary) and English.
- **RTL Layout Engine**: Implement a robust Right-to-Left (RTL) CSS architecture that applies globally when Arabic is active.
- **Arabic-First Design System**: Ensure all base typography, component structures, and alignments are built specifically for Arabic reading patterns first, before gracefully adapting to Left-to-Right (LTR) for English.
- **Translation Management**: Establish the locale dictionaries for all static text across the application.

#### Iteration Log

**Iteration 1** (2026-03-26):
- **What was done:**
  - Created `src/dictionaries/ar.json` and `src/dictionaries/en.json` — translation dictionaries for all static text (login, dashboard, roles, common).
  - Created `src/lib/locale-config.ts` — **client-safe** locale config: `Locale` type, `LOCALES`, `DEFAULT_LOCALE`, `hasLocale`, `getDir`. No `"server-only"` dependency.
  - Created `src/lib/i18n.ts` — **server-only** module (`import "server-only"`) that re-exports from `locale-config` and adds `getDictionary` (dynamic JSON import per locale).
  - Created `src/context/locale-context.tsx` — client context `LocaleProvider` + `useLocale` hook. Provides `locale`, `dict`, `dir`, and `switchLocale` (swaps locale segment in pathname, pushes with router).
  - Created `src/components/html-attributes.tsx` — client component that sets `document.documentElement.lang` and `.dir` via `useEffect`. Needed because nested layouts can't render `<html>` in Next.js App Router.
  - Restructured `src/app/` — all pages moved under `src/app/[lang]/`: `login/page.tsx`, `dashboard/layout.tsx`, `dashboard/page.tsx`, `dashboard/admin/page.tsx`, `dashboard/teacher/page.tsx`, `dashboard/student/page.tsx`. Old non-locale routes deleted.
  - `src/app/[lang]/layout.tsx` — server component, fetches dictionary, wraps with `LocaleProvider`, mounts `HtmlAttributes`. Uses `generateStaticParams` to pre-render both locales.
  - `src/app/layout.tsx` (root) — loads Tajawal font, sets default `lang="ar" dir="rtl"` on `<html>` (overridden client-side per locale). Wraps with `AuthProvider`.
  - `src/app/page.tsx` — redirects to `/{DEFAULT_LOCALE}` (i.e. `/ar`).
  - Updated `src/proxy.ts` — locale-aware: detects locale prefix, redirects non-prefixed paths to default locale, enforces auth + RBAC using locale-prefixed paths.
  - Updated `src/lib/auth.ts` — `getRoleDashboardPath(role, locale)` now accepts locale param, returns `/{locale}/dashboard/{role}`.
  - Installed Tajawal Arabic font from Google Fonts (`next/font/google`). Added to `globals.css` as `--font-tajawal`.
  - Build passes with zero errors. All 12 locale-prefixed routes generated: `/ar/*` and `/en/*`.
- **Issues/Lessons:**
  - `"server-only"` in `i18n.ts` caused build error when `locale-context.tsx` (a client component) imported from it. Fixed by splitting: `locale-config.ts` (client-safe, no server-only) vs `i18n.ts` (server-only, contains getDictionary).
  - In Next.js App Router, nested layouts cannot render `<html>/<body>` — only the root layout can. Used `HtmlAttributes` client component with `useEffect` to update `lang`/`dir` on `document.documentElement` instead.

### [NOT_STARTED] Milestone 3: Design System & UI/UX Guidelines
- Construct the global CSS and Tailwind theme rules enforcing a minimal, gentle, and clean aesthetic.
- Define a bright but soft color palette (strictly non-blinding/not overly colorful).
- Build the layout structures strictly avoiding playful elements (NO emojis, NO cartoonish visuals, NO heavy/stupid animations).

### [NOT_STARTED] Milestone 4: Admin Setup - School Structure & Users
- Add classes/grades (صف) and sections (شعبة).
- Add subjects (المقررات).
- Add teachers -> assign to class-section(s) and subject(s).
- Add students -> assign them to class-section(s).

### [NOT_STARTED] Milestone 5: Teacher Setup & Dashboard
- View assigned class-sections and students.
- Post learning materials (text, docs, videos, links, images) for a class or section(s). *Note: cannot assign the same material/homework across different classes (صفوف) at the same time, must be done separately. Can be done together for sections of the same class.*
- Assign homework for full class-section(s). Submission types: online or on-site.
- View and evaluate student submissions.
- Post news and announcements for all assigned classes, a specific class, or a specific section. (Admin can also post global announcements from their end).

### [NOT_STARTED] Milestone 6: Student Setup & Dashboard
- View, react, and comment on news posts.
- Read, download, and comment on learning materials. (Comments are visible to everyone).
- Submit homework online in multiple formats as required (text, docs, videos, links, images).
- View exams schedule (schedules are set by the Admin).

### [NOT_STARTED] Milestone 7: Interactive Quizzes
- Implement interactive timed quizzes with automatic grading.

### [NOT_STARTED] Milestone 8: Superadmin Capabilities & Monitoring
- **User Management**: Full ability to create, edit, suspend, or delete any student or teacher account, and modify their roles.
- **Academic Structuring**: Ultimate, global control over the school's blueprint. This means the ability to create new grades (e.g., "12th Grade") or subjects, merge/split sections, and forcefully reassign or remove teachers and students, regardless of current assignments.
- **Unconditional Content Moderation**: Ability to edit, delete, or hide any news post, announcement, comment, or educational material posted by anyone across the entire platform.
- **Platform Monitoring**: View system-wide activity, such as total enrollments, active classes, storage/usage statistics, and user engagement metrics across the school.
- **Global Settings**: Control system-level configurations (e.g., toggling global community comments, updating school-wide schedules and holidays).

### [NOT_STARTED] Milestone 9: Final Polish & Handoff
- End-to-end testing of all user journeys (Admin, Teacher, Student).
- UI/UX refinements.
- Final deployment.

