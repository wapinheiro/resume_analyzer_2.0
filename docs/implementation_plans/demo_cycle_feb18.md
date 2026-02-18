# Implementation Plan: Demo Cycle Feb 18, 2026

Source: `docs/demo-reviews/feb_18_demo_feedback.md`

---

## Overview

7 improvements derived from a live user demo session. All are scoped to this implementation cycle. Item #1 (Home Page UX) is the highest priority. PDF Download (Item 4) has been deferred to a future cycle pending library selection.

---

## Priority Order

| # | Item | Files Affected | Priority |
|---|------|---------------|----------|
| 1 | Home page UX: single-path entry | `frontend/src/app/page.tsx`, `Navbar.tsx`, `ResumeUpload.tsx` | 🔴 High |
| 5 | Optimized Version: framing & trust | `frontend/src/app/optimize/page.tsx`, `backend/app/prompts/analyzer_system.md` | 🟠 Medium |
| 6 | Download: informed consent modal | `frontend/src/app/optimize/page.tsx` | 🟠 Medium |
| 7 | BYU color scheme | `frontend/src/app/globals.css` | 🟠 Medium |
| 2 | Actionable Fixes: duplicate text | `backend/app/prompts/analyzer_system.md`, `frontend/src/app/analysis/page.tsx` | 🟡 Low |
| 3 | Bold text rendering in Optimized View | `frontend/src/app/optimize/page.tsx` | 🟡 Low |
| 4 | PDF Download (student-friendly output) | `frontend/src/app/optimize/page.tsx` | ⏸️ Deferred — disable button for now |

---

## Item 4 — PDF Download (Deferred)

> ⏸️ Deferred to next cycle pending library selection (`html2canvas+jsPDF` vs `@react-pdf/renderer`).

#### [MODIFY] `frontend/src/app/optimize/page.tsx`
- Disable the `Download` button with `disabled` attribute and a `title="Coming soon"` tooltip
- Remove `Copy All Changes` button (no handler, redundant)
- Replace `[COPY MARKDOWN]` with **`[COPY AS PLAIN TEXT]`** — strip `**`, `#`, `-` markers before copying

---

## Item 1 — Home Page UX

#### [MODIFY] `frontend/src/components/ui/Navbar.tsx`
- Hide `Dashboard` link when `localStorage('analysisResult')` is empty

#### [MODIFY] `frontend/src/app/page.tsx`
- Remove terminal illustration header (`TypewriterEffect` + terminal box)
- Merge upload box and analyze button into a single **"Mega-Button"** component
  - Label: `Upload Resume to Begin`
  - Clicking opens file picker
  - Selecting a file triggers analysis immediately (no separate "Analyze" click)

---

## Item 5 — Optimized Version: Framing & Trust

#### [MODIFY] `frontend/src/app/optimize/page.tsx`
- Rename page header from `"The Vision"` → `"What Your Resume Could Look Like"`
- Add a disclaimer banner above the resume panel:
  > ⚠️ *AI-generated illustration. Content in brackets (e.g., `[X]%`) is estimated. Use as a structural guide — do not submit as-is.*

#### [MODIFY] `backend/app/prompts/analyzer_system.md`
- Instruct the AI to wrap all fabricated/estimated values in `[X]` brackets so they are visually identifiable

---

## Item 6 — Download: Informed Consent Modal

#### [MODIFY] `frontend/src/app/optimize/page.tsx`
- On `Download` click, show a modal before triggering PDF export:
  - Title: `⚠️ Before you download`
  - Body: explain AI-generated nature, instruct to replace `[X]` values
  - Actions: `[ Cancel ]` and `[ Download PDF ]`

---

## Item 7 — BYU Color Scheme

#### [MODIFY] `frontend/src/app/globals.css`

| Token | Current | New |
|-------|---------|-----|
| `--primary` | `#2563eb` | `#0047BA` (BYU Royal Blue) |
| `--background` | `#0f172a` | `#141414` (BYU Dark Gray) |
| `--surface` | `#1e293b` | `#0a1628` (Navy-tinted dark) |
| `--primary-glow` | `#60a5fa` | `#BDD6E6` (BYU Light Blue) |
| Text gradient | Blue→Purple | Royal Blue→Light Blue |

---

## Item 2 — Actionable Fixes: Duplicate Text

#### [MODIFY] `backend/app/prompts/analyzer_system.md`
- Add `reason` field to each `issue` object in the JSON schema:
  ```json
  {"type": "String", "reason": "Why this is a problem", "fix": "Specific action"}
  ```

#### [MODIFY] `frontend/src/app/analysis/page.tsx`
- Replace `{issue.description || issue.fix}` with `{issue.reason}`
- Keep `{issue.fix}` in the "Recommended Action" box

---

## Item 3 — Bold Text Rendering

#### [MODIFY] `frontend/src/app/optimize/page.tsx`
- Extract a shared `renderInline(text)` helper that converts `**...**` → `<strong>`
- Apply `renderInline()` to list items (`<li>`) and headers in `MarkdownViewer`

---

## Round 2 — Post-Deployment Review Fixes

Identified from live deployment review on Feb 18, 2026.

| # | Item | Files Affected | Priority |
|---|------|---------------|----------|
| R1 | BYU light color scheme (full redesign) | `frontend/src/app/globals.css`, all pages | 🟠 Medium |
| R2 | Analysis layers: default to first layer | `frontend/src/app/analysis/page.tsx` | 🟡 Low |
| R3 | Rename "View Optimized Version" button | `frontend/src/app/analysis/page.tsx` | 🟡 Low |

### R1 — BYU Light Color Scheme

BYU's actual web presence uses a **light background** with navy/blue accents, not dark mode.

#### [MODIFY] `frontend/src/app/globals.css`

| Token | Current | New |
|-------|---------|-----|
| `--background` | `#141414` (dark) | `#F5F5F5` (light gray) |
| `--surface` | `#0a1628` (navy-dark) | `#FFFFFF` (white) |
| `--primary` | `#0047BA` | `#0047BA` (keep — BYU Royal Blue) |
| `--text-main` | `#f8fafc` (white) | `#002E5D` (BYU Navy) |
| `--text-muted` | `#94a3b8` | `#6E7CA0` (BYU Blue Gray) |
| Navbar bg | dark glass | `#002E5D` (BYU Navy) with white text |
| Text gradient | Blue→Purple | Royal Blue→Light Blue |

- Navbar: solid BYU Navy background (`#002E5D`) with white text — the signature BYU look
- Cards/panels: white with subtle navy border
- Optimize page resume panel: add card border/shadow to distinguish from white background

### R2 — Analysis Layers: Default to First Layer

#### [MODIFY] `frontend/src/app/analysis/page.tsx`
- Change `useState('impact')` → `useState('format')` so the first layer is selected on load

### R3 — Rename "View Optimized Version" Button

#### [MODIFY] `frontend/src/app/analysis/page.tsx`
- Change button label from `"View Optimized Version"` → `"View Suggested Rewrite"`
- Rationale: honest framing — it's a suggestion, not a final product

---

## Verification Plan

### Automated
- Run `npm run build` in `frontend/` — must pass with zero ESLint errors

### Manual
- Upload a real resume PDF and walk through the full happy path:
  1. Home → upload triggers analysis immediately (no disabled button)
  2. Dashboard link hidden until analysis exists (verify in incognito)
  3. Analysis page: first layer (Format) selected by default
  4. Analysis page: `reason` text differs from `fix` text
  5. Analysis page: "View Suggested Rewrite" button label
  6. Optimized page: bold renders correctly in list items
  7. Optimized page: disclaimer banner visible
  8. Download button disabled with "Coming Soon" tooltip
  9. Color scheme: light BYU theme — navy navbar, white body, royal blue accents
