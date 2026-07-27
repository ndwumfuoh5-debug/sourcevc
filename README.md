# Pitch Deck Submission Portal

## High-level Strategy and Goal

A full-stack internal tool for a Venture Capital firm. It has two surfaces:

1. **Founder-facing submission form** (`/`) — a clean, professional multi-section form where founders submit their pitch decks. No authentication required to submit.
2. **VC Dashboard** (`/dashboard`) — an internal review tool where the VC team can browse, filter, update status, add notes, and delete submissions.

---

## Changes Implemented

### Models
- `src/shared/models/pitch-submission.ts` — TypeScript interfaces (`PitchSubmission`, `PitchSubmissionCreate`, `PitchSubmissionUpdate`) and all dropdown option constants (`ARR_OPTIONS`, `STAGE_OPTIONS`, `INDUSTRY_OPTIONS`, `MARKET_OPTIONS`, `TOTAL_RAISED_OPTIONS`, `TEAM_SIZE_OPTIONS`, `HOW_HEARD_OPTIONS`, `STATUS_OPTIONS`, `STATUS_LABELS`, `STATUS_COLORS`).

### API Routes
- `src/app/api/submissions/route.ts` — `GET` (with optional `status`, `stage`, `industry`, `arr` query filters) and `POST` (create new submission). Maps snake_case DB columns to camelCase.
- `src/app/api/submissions/[id]/route.ts` — `PATCH` (update status/notes, sets `reviewed_at` on status change) and `DELETE`.

### Client Library
- `src/client-lib/api-client.ts` — SWR hook `useSubmissions(filters?)`, `buildSubmissionsKey(filters)`, `createSubmission`, `updateSubmissionStatus` (optimistic), `deleteSubmission` (optimistic).
- `src/components/SWRProvider.tsx` — Global SWR config with `revalidateOnFocus: false`, `dedupingInterval: 30000`, `keepPreviousData: true`.

### Pages
- `src/app/page.tsx` — Founder pitch submission form with 5 sections (Your Info, Your Company, The Pitch, Traction, Pitch Deck), inline validation, character counters, loading state on submit, and a success screen.
- `src/app/dashboard/page.tsx` — VC dashboard with stat cards, filter bar (status/stage/industry/ARR + client-side search), submissions table with optimistic status changes and deletes, and a detail Sheet with notes auto-save.
- `src/app/dashboard/loading.tsx` — Skeleton loading state mirroring the dashboard layout.

### Config & Layout
- `src/config/nav-links.ts` — Added Dashboard nav link with `LayoutDashboard` icon.
- `src/app/layout.tsx` — Wrapped children with `<SWRProvider>`.

---

## Architecture and Technical Decisions

- **Database**: Uses the existing `pitch_submissions` Postgres table. All queries use parameterized statements to prevent SQL injection.
- **camelCase mapping**: DB rows (snake_case) are mapped to camelCase TypeScript interfaces in the API route handlers, keeping the client code clean.
- **SWR key strategy**: All submission list keys start with `/submissions`, enabling wildcard cache invalidation (`key.startsWith('/submissions')`) across all filter combinations. `buildSubmissionsKey` is the single source of truth for key construction.
- **Optimistic updates**: Status changes and deletes update the UI instantly via SWR's `optimisticData` callback, with `rollbackOnError: true` for safety. Errors surface via sonner toasts.
- **Notes auto-save**: Debounced 800ms PATCH call from the detail Sheet, with a "Saved ✓" indicator.
- **No extra packages**: Everything built with existing shadcn components, SWR, axios, and lucide-react.
