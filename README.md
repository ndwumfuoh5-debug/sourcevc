# Healthworx Capital — Pitch Portal

## High-level Strategy and Goal

A full-stack internal tool for Nana Dwumfuoh's Healthworx Capital. It has two surfaces:

1. **Founder-facing website** (`/`) — a full-page marketing + submission site with a dark hero, animated particle canvas, thesis section, and a multi-section pitch form. No authentication required to submit.
2. **VC Dashboard** (`/dashboard`) — an internal review tool where the VC team can browse, filter, update status, add notes, and delete submissions.

---

## Changes Implemented

### Models
- `src/shared/models/pitch-submission.ts` — TypeScript interfaces and all dropdown option constants.

### API Routes
- `src/app/api/submissions/route.ts` — `GET` (with optional filters) and `POST` (create new submission).
- `src/app/api/submissions/[id]/route.ts` — `PATCH` (update status/notes) and `DELETE`.

### Client Library
- `src/client-lib/api-client.ts` — SWR hook `useSubmissions(filters?)`, `createSubmission`, `updateSubmissionStatus` (optimistic), `deleteSubmission` (optimistic).
- `src/components/SWRProvider.tsx` — Global SWR config.

### Pages & Layout
- `src/app/layout.tsx` — Stripped to bare minimum (ThemeProvider + SWRProvider + Toaster). No sidebar/topbar chrome at root level.
- `src/app/page.tsx` — Thin orchestrator that assembles the pitch website sections.
- `src/app/dashboard/layout.tsx` — Dashboard-specific layout that adds the Topbar and `pt-12` padding.
- `src/app/dashboard/page.tsx` — VC dashboard with stat cards, filters, table, and detail Sheet.
- `src/app/dashboard/loading.tsx` — Skeleton loading state.

### Pitch Website Components (`src/components/pitch/`)
- `KineticWord.tsx` — Animated cycling word ("Healthcare." / "Founders." / "Solutions.") with fade-up transition.
- `PitchNavbar.tsx` — Fixed transparent navbar that transitions to white with shadow when scrolled off the dark hero (IntersectionObserver on `#hero`).
- `HeroSection.tsx` — Full-viewport dark espresso hero with particle canvas, radial spotlight, eyebrow badge, giant headline, and dual CTA buttons.
- `AboutSection.tsx` — White section with "Our Focus" eyebrow, headline, body copy, and 3 principle cards with hover animations.
- `PitchFormSection.tsx` — Full 5-section pitch submission form with validation, success state, and walnut-themed styling.
- `PitchFooter.tsx` — Dark espresso footer matching the hero.

### Canvas Animation
- `src/components/WarmParticleCanvas.tsx` — Canvas-based rising particle system with warm amber/gold particles along grid columns. Uses `requestAnimationFrame`, `ResizeObserver`, and radial gradient glow per particle.

### Styling
- `globals.css` — Updated CSS variables: pure white `--background`, sienna `--primary` (`20 60% 35%`). Added `.hero-gradient`, `.grid-pattern-dark`, `.grid-pattern-light` utility classes.

### Topbar
- `src/components/Topbar.tsx` — Restyled: white background, walnut wordmark with amber pulse dot, user avatar dropdown (ThemeToggle removed for cleaner look).

---

## Architecture and Technical Decisions

- **Layout split**: Root layout has zero chrome. The dashboard route gets its own `layout.tsx` that injects the Topbar. The pitch page manages its own fixed navbar inline. This avoids the sidebar/topbar appearing on the public-facing pitch website.
- **Component decomposition**: The pitch page is split into 5 focused components under `src/components/pitch/` to stay within file size limits and keep each concern isolated.
- **Canvas animation**: Implemented with raw Canvas 2D API (no library) for minimal bundle impact. Particles rise along grid column center-lines, fade in/out based on vertical progress, with a radial gradient glow per particle.
- **Navbar state**: Uses `IntersectionObserver` on `#hero` (threshold 0.15) to toggle between transparent/dark-text and white/shadow modes. Avoids scroll event polling.
- **Color palette**: All warm walnut/espresso colors are applied via inline `style` props (not Tailwind classes) to ensure exact hex values are used without Tailwind purging or approximating them.
- **Database**: Uses the existing `pitch_submissions` Postgres table. All queries use parameterized statements.
- **SWR key strategy**: All submission list keys start with `/submissions`, enabling wildcard cache invalidation across all filter combinations.
- **Optimistic updates**: Status changes and deletes update the UI instantly via SWR's `optimisticData` callback, with `rollbackOnError: true`.
