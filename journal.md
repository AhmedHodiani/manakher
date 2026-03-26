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

### [NOT_STARTED] Milestone 2: support 2 languanges arabic and english & RTL Architecture (Arabic First)
- **Internationalization (i18n) Setup**: Configure the Next.js foundation for seamless switching between Arabic (Default/Primary) and English.
- **RTL Layout Engine**: Implement a robust Right-to-Left (RTL) CSS architecture that applies globally when Arabic is active.
- **Arabic-First Design System**: Ensure all base typography, component structures, and alignments are built specifically for Arabic reading patterns first, before gracefully adapting to Left-to-Right (LTR) for English.
- **Translation Management**: Establish the locale dictionaries for all static text across the application.

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

