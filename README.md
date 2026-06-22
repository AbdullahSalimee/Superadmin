# Academy Management Platform — Super Admin UI

A dark-themed (Vercel-style), mobile-first Super Admin console for the Academy
Management System, built with Next.js (App Router), TypeScript, and Tailwind CSS.
This is a **UI prototype with dummy/demo data** — there is no backend or database
wired up yet.

## What's included

### Part 1 — Platform Dashboard (Super Admin layer)
Built from the Super Admin PRD Addendum. This is the outer layer, reachable at `/`:
- Platform summary cards: Total Academies, Active Academies, Total Students,
  Total Staff, Platform Revenue (this month), Platform Due (this month)
- Academy List with search, status filter (Active / Trial / Suspended / All),
  and per-academy actions: **Enter**, Edit Academy, Manage Admins (reveal/reset
  shared passwords), Delete Academy (soft-delete, name-confirmation guard)
- Quick Actions panel (Add Academy, Add Admin, View All Academies)
- Full Academies page at `/academies`

### Part 2 — Academy Interior (base AMS, reused via impersonation)
Clicking **Enter** on any academy drops you straight into that academy's full
Admin interface — no login step — at `/academy/[id]/...`:
- Dashboard (summary cards, notifications, quick actions)
- Students (list, add, edit, profile with Avg Score / Attendance / Fee Status
  boxes and their expanded modules, Analytics page with charts)
- Attendance (daily marking + monthly record view)
- Fees (current-month tracking with Pay confirmation) and Fee Record (yearly table)
- Tests (list, create, marks entry) and Test Record (yearly table)
- Results (per-test summary with ranking)
- Classes & Subjects

A persistent blue banner ("Viewing as Super Admin — `<Academy Name>`") with an
Exit button appears on every screen inside an academy, per the addendum's
impersonation spec.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

To build for production:

```bash
npm run build
npm start
```

## Notes on this build

- **Dummy data**: five seeded academies with realistic classes, students,
  attendance, fees, tests, and results, generated deterministically in
  `lib/data.ts`. No two academies use literally identical data.
- **In-memory state**: edits (adding a student, marking attendance, paying a
  fee, creating a test, etc.) update local React state for that session, so
  the UI feels real, but nothing persists across a page reload. This is
  intentional for a UI-first prototype — wiring to Supabase is the next step.
- **PDF export / WhatsApp share buttons** are present in the UI but are
  simulated (no actual file is generated) — they're placeholders for the
  real jsPDF + html2canvas + Web Share API implementation described in
  the PRD.
- **Login screen** at `/login` shows the three-role selector (Super Admin /
  Admin / Teacher) for completeness, but doesn't enforce real authentication
  in this prototype.

## Project structure

```
app/
  (superadmin)/        Platform Dashboard, Academies, Settings — Part 1
  academy/[id]/        Academy interior — Part 2 (Dashboard, Students, etc.)
  login/                Unified role-selection login screen
components/
  ui/                   Shared primitives (Button, Card, Modal, Input, Badge...)
  superadmin/            Part 1 components (AcademyList, modals, sidebar)
  academy/               Part 2 components (StudentForm, charts, sidebar...)
lib/
  data.ts                Dummy data generator + accessor functions
  utils.ts               Formatting & derived-calculation helpers
types/
  index.ts               Shared TypeScript types matching the Supabase schema
```
