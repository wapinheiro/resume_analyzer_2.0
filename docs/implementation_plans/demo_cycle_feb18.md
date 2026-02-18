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

## Verification Plan

### Automated
- Run `npm run build` in `frontend/` — must pass with zero ESLint errors

### Manual
- Upload a real resume PDF and walk through the full happy path:
  1. Home → upload triggers analysis immediately (no disabled button)
  2. Dashboard link hidden until analysis exists
  3. Analysis page: `reason` text differs from `fix` text
  4. Optimized page: bold renders correctly in list items
  5. Optimized page: disclaimer banner visible
  6. Download button → modal appears → PDF downloads correctly
  7. Color scheme matches BYU brand palette
