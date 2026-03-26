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

### [HANDOFF] Milestone 3: Design System & UI/UX Guidelines
- Construct the global CSS and Tailwind theme rules enforcing a minimal, gentle, and clean aesthetic.
- Define a bright but soft color palette (strictly non-blinding/not overly colorful).
- Build the layout structures strictly avoiding playful elements (NO emojis, NO cartoonish visuals, NO heavy/stupid animations).

#### Iteration Log

**Iteration 1** (2026-03-26):
- **What was done:**
  - Swapped Tajawal → **Cairo** font everywhere (`layout.tsx`, `globals.css`). CSS variable renamed `--font-tajawal` → `--font-cairo`.
  - Rewrote `globals.css` with a full Tailwind v4 `@theme inline` block defining all design tokens:
    - **Surface**: `--color-surface` (off-white page bg), `--color-surface-card` (white cards), `--color-surface-sunken` (input bg), `--color-surface-hover`.
    - **Border**: `--color-border`, `--color-border-subtle`.
    - **Ink (text)**: `--color-ink` (primary), `--color-ink-secondary`, `--color-ink-placeholder`, `--color-ink-disabled`, `--color-ink-inverse`.
    - **Accent**: muted calm blue (`#3b7dd8`), hover, subtle tint, text variant.
    - **Status**: danger, success, warning with bg/text variants.
    - **Role tints**: admin (purple), teacher (green), student (amber) — for role badges.
    - **Radii**: sm/md/lg/xl/full.
    - **Shadows**: xs/sm/md — subtle, not dramatic.
  - Added base reset: `text-align: start` for RTL/LTR, subtle scrollbar styling, focus-visible ring using accent color.
  - Created `src/components/ui/` shared primitives:
    - `card.tsx` — `<Card>` with design-token border/shadow/radius.
    - `badge.tsx` — `<Badge>` with variants: default, admin, teacher, student, accent.
    - `button.tsx` — `<Button>` with variants: primary, ghost, danger.
    - `stat-card.tsx` — `<StatCard icon label value>` with accent-tinted icon box.
    - `input.tsx` — `<Input label>` with sunken bg, focus ring, RTL-compatible.
  - Restyled login page: brand mark (accent square with "م"), form card with rounded-xl, uses `<Input>` and `<Button>` primitives.
  - Restyled dashboard layout: sticky header with Cairo, role `<Badge>`, compact lang-switcher and sign-out buttons.
  - Restyled all 3 dashboard role pages using `<StatCard>`. Added greeting line with user name.
  - Expanded both dictionaries with stat card labels (`stats` key) and a `greeting` key.
  - Build passes with zero errors.
- **Issues/Lessons:**
  - Tailwind v4 uses `@theme inline { ... }` (not `theme: { extend: {} }` in a config file). All custom tokens must be CSS variables inside that block.
  - Using CSS variable references in Tailwind class strings (e.g. `bg-[var(--color-accent)]`) works perfectly in v4 with no extra config.

**Iteration 2** (2026-03-26) — visual overhaul:
- **What was done:**
  - Full design system overhaul requested: platform was too muted/corporate, needed vibrant + child-appropriate while staying high-quality and structured.
  - **globals.css**: Replaced cold grey palette with warm ivory base (`#faf8f5`). Accent shifted from flat corporate blue → rich deep violet (`#5b21b6`). Added a full role color system: admin=violet, teacher=teal/emerald, student=amber/orange. Added 4 distinct stat card color slots (sky blue, green, pink, yellow) driven by CSS `nth-child` rules. Added `--shadow-lg` and `--radius-2xl` tokens. Font weight headings bumped to `font-weight: 700`.
  - **stat-card.tsx**: Redesigned — icon area enlarged to 48×48, icons scale to 24px via `[&>svg]` selector. Number enlarged to `text-3xl font-bold`. Color slots via `.stat-icon` CSS class + nth-child system.
  - **badge.tsx**: Added `font-semibold` to role variants, increased horizontal padding.
  - **button.tsx**: Added `secondary` variant, bumped to `font-semibold`, primary gets `shadow-sm` + lift on hover.
  - **card.tsx**: Rounded up from `radius-lg` to `radius-xl`.
  - **input.tsx**: Label → `font-semibold`, more padding (`py-3 px-4`), `focus:bg-white` for clarity.
  - **login/page.tsx**: Full redesign — split-panel layout on desktop (lg+). Left panel: deep violet gradient with soft circle textures, large frosted-glass brand mark, app name. Right panel: clean form, `radius-2xl` card, taller input/button, absolute language switcher. Mobile: stacked with smaller brand mark visible.
  - **dashboard/layout.tsx**: Added 3px role-colored gradient strip at top of header. Brand mark now uses matching role gradient. Sign-out button gains red hover. Language switcher gets a border. Loader spinner colored with accent.
  - **admin/page.tsx + teacher/page.tsx + student/page.tsx**: Added `stat-card-group` wrapper class for nth-child color injection. Page headers: `text-3xl font-black`, role-colored greeting name, role-specific gradient underline bar (h-1 w-14). Icons passed without size class (handled inside StatCard).
  - Build passes cleanly: 16 pages, zero errors.
- **What I struggled with / watch out for:**
  - `insetInlineEnd` / `insetInlineStart` used in login decorative circles for RTL safety — these are logical CSS properties and work correctly in both LTR and RTL.
  - Tailwind v4 doesn't support arbitrary gradient `from`/`to` values via CSS variables in class strings (e.g., `from-[var(--x)]`) for background-gradient shorthand — workaround: use `bg-gradient-to-r` class + individual `from-[...]` and `to-[...]` arbitrary value classes. These DO work with CSS vars as arbitrary values.
  - nth-child stat card coloring requires the `.stat-card-group` wrapper directly wrapping the grid children (not an extra wrapper div per card).

**Iteration 3** (2026-03-26) — school identity + bilingual names + visual polish:
- **What was done:**
  - School identity set: `مدرسة مناخر الاساسية المؤنثة` / `Manakher Basic Girls' School`. All dictionaries updated (`schoolName` key added to `common`). Root layout `<title>` and `<meta description>` updated. Cairo font weight extended to include 800 and 900.
  - **PocketBase schema**: `users` collection — removed `name` field, added `name_ar` (required text) and `name_en` (required text). All 3 seed users re-seeded with proper bilingual names (admin, teacher, student).
  - **`AuthUser` type** in `lib/auth.ts`: replaced `name: string` with `name_ar: string` + `name_en: string`. Added `getDisplayName(user, locale)` helper — returns `name_ar` in Arabic locale, `name_en` in English, falls back to email.
  - **`getDisplayName`** wired everywhere: dashboard layout header, all 3 dashboard pages (admin/teacher/student greeting).
  - **Dashboard layout**: Added school name as small subtitle under brand mark. Header height bumped to h-16. Added a thin footer with school name. Loading spinners now use accent color. Applied `bg-surface-dotted` to the main page area for texture.
  - **Login page**: Left panel shows full school name as primary `<h1>`. Right panel has proper welcome heading separate from school title. School name repeated as footer note below form card. Dot-grid background on form side.
  - **globals.css**: Added `.bg-surface-dotted` utility class (dot-grid radial-gradient pattern). Heading default weight bumped to 800.
  - **Dashboard pages (admin/teacher/student)**: Replaced flat page header with a full-width role-colored gradient welcome banner (matches each role's color system). Added "نظرة عامة / Overview" section heading above stat grid.
  - **StatCard**: Added hover lift (`hover:-translate-y-0.5 hover:shadow-md`). Empty `"—"` value now renders in `ink-disabled` color (intentional, not broken-looking). Label bumped to `font-semibold`.
  - Build: 16 pages, zero errors, zero TS warnings.
- **Watch out for:**
  - MCP PocketBase tool still drops auth between calls — always re-authenticate with curl and use `_superusers` collection endpoint, not `/api/admins/`.
  - `bg-surface-dotted` is a custom CSS class, not a Tailwind utility — don't try to use it with Tailwind's JIT scanning, it's defined in `globals.css` directly.

### [HANDOFF] Milestone 4: Admin Setup - School Structure & Users
- Add classes/grades (صف) and sections (شعبة).
- Add subjects (المقررات).
- Add teachers -> assign to class-section(s) and subject(s).
- Add students -> assign them to class-section(s).

#### Iteration Log

**Iteration 1** (2026-03-26) — PocketBase collections + full teacher dashboard built:
- **What was done:**
  - Created 4 new PocketBase collections: `materials`, `homework`, `submissions`, `announcements`. All with proper API rules (teachers can create/edit their own records, students can submit, admins can delete anything).
  - Added `getPocketBase()` named export to `lib/pocketbase.ts` for cleaner imports.
  - Extended `ar.json` + `en.json` dictionaries with full teacher dashboard keys (nav, sections, materials, homework, announcements).
  - Created `src/app/[lang]/dashboard/teacher/layout.tsx` — sidebar nav with 5 links (Overview, My Sections, Materials, Homework, Announcements). Uses teal teacher role colors. Desktop sidebar + mobile bottom tab bar.
  - Rewrote `teacher/page.tsx` — live stat counts from PocketBase (subjects count from user record, student count via filter on assigned sections, homework count, pending submissions count).
  - Created `teacher/sections/page.tsx` — collapsible accordion per section, shows student roster with avatar initials, fully bilingual.
  - Created `teacher/materials/page.tsx` — CRUD for learning materials. Filter by section/subject. Supports types: text (with textarea), link, video (with URL field), file. Expand query shows section+subject names.
  - Created `teacher/homework/page.tsx` — CRUD for homework assignments. Expandable submissions panel per homework. Teachers can grade submissions inline (grade + feedback). Status badge updates to "graded".
  - Created `teacher/announcements/page.tsx` — CRUD for announcements. Scope: "global" (all my sections) or "section" (specific section). Section picker shown conditionally.
  - Build: 32 pages, zero TypeScript errors.
- **Struggles / watch out:**
  - MCP auth drops between calls — always re-auth via curl with `_superusers` for any PocketBase admin operations.
  - PocketBase `expand` on relation fields requires the relation to be defined with proper `collectionId` on the field schema. Used `pbc_3098803551` (class_sections) and `pbc_3949707534` (subjects) when creating collections via curl.
  - `submissions` filter `homework.teacher = "${user.id}"` works via PocketBase relation traversal — no join needed.
- **What was done:**
  - PocketBase schema confirmed: `class_sections` (20 records), `subjects` (9 records), `users` with `sections` (multi-relation maxSelect 999) + `subjects` (multi-relation maxSelect 999). Single `section` field was removed by user — both teachers and students now use `sections`.
  - Extended `ar.json` + `en.json` dictionaries with full admin management keys: nav labels, form field labels, confirm/empty strings, plus common actions (save, cancel, delete, back, search).
  - Created `src/app/[lang]/dashboard/admin/layout.tsx` — sidebar nav with 5 links (Overview, Classes & Sections, Subjects, Teachers, Students). Desktop: vertical sidebar. Mobile: fixed bottom tab bar. Active state uses violet admin role colors.
  - Created `sections/page.tsx` — list grouped by grade_order, inline add form (grade_ar/en/order + section_ar/en), delete with confirm. Sections displayed as card per grade with rows per section.
  - Created `subjects/page.tsx` — flat list with name_ar/en + code, inline add form, delete.
  - Created `teachers/page.tsx` — multi-select dropdowns (custom checkbox dropdown component) for sections + subjects assignment. Expand query used to show assigned section/subject pills. Creates full user record with role=teacher.
  - Created `students/page.tsx` — single-section radio picker dropdown. Creates user with role=student, sections=[sectionId].
  - Updated `admin/page.tsx` — stat cards now load live counts from PocketBase (total users, sections, teachers, students). Uses `getList(1,1)` to get totalItems without fetching all records.
  - Build: 24 pages, zero TypeScript errors.
- **Struggles / watch out:**
  - Admin layout had a TypeScript error: `keyof` on `ReturnType<typeof useLocale>` produces `string | number | symbol` which isn't assignable to React `Key`. Fixed by using a literal `NavKey` type instead.
  - PocketBase MCP drops auth between calls — always use curl with `_superusers` auth endpoint directly.

**Iteration 2** (2026-03-26) — students seeded:
- **What was done:**
  - Seeded 40 student records (2 per section across all 20 sections, grades 1–10, sections أ+ب). All passwords: `Student@12345`. Realistic Arabic/English names.
  - Total students in DB: 41 (40 seeded + 1 original test student `student@school.edu`).
  - Milestone status updated to HANDOFF.
- **Struggles / watch out:**
  - MCP auto-cancel on parallel calls is a cosmetic SDK error — the record is still written. Retrying causes a "Value must be unique" error confirming the first write succeeded.

### [INPROGRESS] Milestone 5: Teacher Setup & Dashboard
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

