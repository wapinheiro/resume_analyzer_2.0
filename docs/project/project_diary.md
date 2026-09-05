# Resume Analyzer - Project Diary

---

## 2026-09-05: Mandatory Auth Gating & NextAuth Session Fix Deployed

### Achievements & Deployed Changes
1.  **Mandatory Sign-In/Sign-Up Policy Enforcement**:
    -   Unauthenticated visitors now see a prominent **"Sign In to Review Your Resume"** gate card with a direct **"Log In or Create Account"** button routing to `/login`.
    -   Drag-and-drop and upload click actions automatically redirect unauthenticated users to `/login`.
    -   Authenticated users unlock the active PDF upload zone and personalized welcome banner.
2.  **NextAuth Session & Backend Model Fixes**:
    -   Added `NEXTAUTH_SECRET` fallback to eliminate `500 Internal Server Error` on `/api/auth/session` in Cloud Run.
    -   Configured model fallback to `gemini-1.5-flash` in `GeminiService`.
3.  **Production Deployment Revisions**:
    -   **Backend**: Revision `resume-analyzer-backend-00039-2l6` live on Cloud Run.
    -   **Frontend**: Revision `resume-analyzer-frontend-00033-drg` live on Cloud Run.

---

## 2026-09-05: Homepage Hero Copy & Branding Refinements Deployed

### Achievements & Deployed Changes
1.  **Refined Production Deployment Live**:
    -   Successfully built and deployed revision `resume-analyzer-frontend-00031-x9c` to `https://resume-analyzer-frontend-87294979859.us-central1.run.app`.
    -   Serving 100% of production traffic.
2.  **Hero & Brand Refinements**:
    -   **Navbar & Brand**: Dropped `2.0` suffix to unify brand as `Resume Analyzer`.
    -   **Eyebrow Pill**: Updated top pill text to `BYU Computer Science • A Thread tool`.
    -   **Headline**: Simplified headline to `Resume Analyzer`.
    -   **Feature List**: Converted subheadline into a clear 4-item bullet list with SVG icons (*A 5-part review, An overall score, What your resume emphasizes, An optimized version you can use*).
    -   **Trust Badges**: Removed FERPA/PII/BYU CS badges row for concise messaging.
    -   **Upload Box**: Updated call-to-action title to `Upload Resume to Review`.

---

## 2026-09-05: Homepage Overhaul & Auth UX Deployment (Option C Live)

### Achievements & Deployed Changes
1.  **Full Option C Redesign Live on Cloud Run**:
    -   Successfully built and deployed revision `resume-analyzer-frontend-00030-k99` to `https://resume-analyzer-frontend-87294979859.us-central1.run.app`.
    -   Routing 100% of production traffic to the new revision.
2.  **Frontend Components & UX Overhaul**:
    -   **Hero Section**: Added gradient branding, FERPA compliance badges, and high-converting CTA upload zone.
    -   **5-Layer Evaluation Framework Grid**: Installed `FrameworkGrid.tsx` detailing ATS, Core Spec, Impact, 6-Sec Storyline, and X-Factor.
    -   **RMS Benchmark Teaser**: Installed `RMSBenchmarkTeaser.tsx` visualizing Market-Ready (90–100), Tourist (75–89), and Student (<75) risk tiers.
    -   **Branded `/login` Page**: Redesigned sign-in experience with dark navy (`#002E5D`) aesthetic, OAuth buttons, and back-to-home navigation.
3.  **Build & Next.js Fixes**:
    -   Resolved NextAuth middleware standard JWT token evaluation on public home routes.
    -   Fixed ESLint JSX quote escaping and Lucide icon imports across advisor analytics pages for clean production Docker builds.

---

## 2026-09-05: Infrastructure Stabilization & Homepage Overhaul Plan

### Achievements & Infrastructure Fixes
1.  **GCP Billing & Edge Restoration**:
    -   Re-enabled GCP Billing account on project `gen-lang-client-0141528519`.
    -   Resolved Cloud Run 500 errors and Google Frontend edge rate-limiting (`429 Rate exceeded`).
    -   Configured Cloud Run `--min-instances=1` on `resume-analyzer-backend` to eliminate cold start database timeouts.
    -   Verified end-to-end database connectivity between Cloud Run and Cloud SQL PostgreSQL.

### Strategic Plan: Homepage & Auth UX Overhaul (Option C)
1.  **Hero Section & Value Proposition**:
    -   Upgrade hero headline to clearly communicate the candidate transformation ("From CS Student to Market-Ready Engineer").
    -   Add trust & compliance badges (*"FERPA Compliant • Privacy-First • Built for BYU CS Students"*).
2.  **5-Layer Framework Showcase**:
    -   Interactive/visual 5-card breakdown of Layer 1 (ATS), Layer 2 (Core Spec), Layer 3 (Impact & CAR), Layer 4 (6-Sec Storyline), and Layer 5 (X-Factor).
3.  **RMS Benchmark Teaser**:
    -   Visual hireability index breakdown (**90-100 Market Ready**, **75-89 The Tourist**, **<75 The Student**).
4.  **Personalized Logged-in Dashboard & Auth UX**:
    -   Dynamic home page view for authenticated users displaying recent resume analyses & Advisor Scheduling CTA.
    -   Brand up `/login` page with BYU CS theme accents (`#002E5D`), logo, and polished UX.

---

## 2026-02-03: Phase 3 Completion - AI Integration & Polish

### Achievements
1.  **AI Integration**: Successfully integrated **Google Gemini Flash** via the `google-generativeai` SDK.
    -   Implemented `GeminiService` to handle prompt injection and response parsing.
    -   Implemented `PDFExtractor` using `pypdf` to convert resumes to text.
    -   **Prompt Engineering**: Created a robust system prompt (`backend/app/prompts/analyzer_system.md`) that acts as an "Elite Recruiter", returning structured JSON.

2.  **Deployment Troubles & Fixes**:
    -   **Model Name**: Initially faced `404` errors with `gemini-1.5-pro`. Switched to `gemini-flash-latest` which resolved availability/quota issues.
    -   **Frontend Build**: Encountered a silent build failure on Vercel because `use client` was missing from the Dashboard component. Fixed and redeployed.

3.  **Frontend Enhancements**:
    -   **Persistence**: Implemented `localStorage` logic to ensure analysis data survives the redirect from Landing Page -> Dashboard.
    -   **UX**: Added a "Simulated Progress" animation to the Analyze button ("Extracting...", "Analyzing...") to manage user expectations during the 3-5s API latency.
    -   **Personalization**: Updated the prompt and UI to extract the Candidate's Name and display "Analysis for [Name]" on the dashboard.

### Current State
The web application is **fully functional**.
-   Users can upload a real PDF.
-   The backend processes it with real AI.
-   The frontend displays real, personalized scores and feedback.
-   Data is persisted in the PostgreSQL database (`analyses` table), including the full raw JSON for future datasets.

### Next Steps (Phase 4 & v2.5)
-   **Homepage & Auth UX Overhaul**: Upgrade landing page, 5-layer framework showcase, RMS benchmarks, and personalized user dashboard.
-   **PDF Export**: Implement PDF export for optimized resume output.
