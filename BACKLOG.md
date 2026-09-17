# Resume Analyzer 2.0 - Product Backlog & Roadmap

This document serves as the master living backlog for tracking **future features**, **known gaps / technical debt**, and **bugs / maintenance items** for the BYU Resume Analyzer project.

---

## 🎯 High-Priority Future Features

### 🏆 1. Homepage Student Leaderboard (Gamification & Incentive Engine)
* **Goal**: Foster healthy competition and incentivize BYU CS students to continuously refine and elevate their resumes to market-ready standards.
* **Location**: Public & Authenticated Homepage (`/`)
* **Key Requirements**:
  - **Top-N Ranking**: Display a leaderboard showcasing the top N students (e.g. Top 10 or Top 25) with the highest Resume Market Score (RMS).
  - **Current Students Only**: Filter results strictly to active/current students (excluding alumni, test accounts, or inactive users).
  - **Student Information & Badges**: Display student name/handle, RMS score badge (e.g. 95+ Market Ready), Major (e.g. Computer Science), and Year (e.g. Senior).
  - **FERPA & Privacy Controls**:
    - Provide an opt-in/opt-out privacy toggle in user profiles (e.g. *"Display my score on the BYU Public Leaderboard"*).
    - Allow anonymous alias/handle display option for students who want to compete privately.
  - **Real-Time / Scheduled Updates**: Recalculate leaderboard dynamically upon new analysis runs or via a daily background cron.

### 📄 2. PDF & Template Export for Optimized Resumes
* **Goal**: Allow students to export AI-suggested optimized resumes directly into usable job-application formats.
* **Key Requirements**:
  - **PDF Export**: Single-click PDF generation matching BYU CS clean resume standards (`jsPDF` / backend rendering).
  - **Plain Text / Markdown Copy**: One-click formatted export without raw markdown symbols for seamless pasting into Google Docs or Word.
  - **Overleaf / LaTeX Template Export**: Direct export of BYU CS LaTeX template pre-filled with optimized bullet points.

### 📊 3. Advisor Analytics & Batch Management
* **Goal**: Expand career advisor capabilities to track department-level readiness and manage student cohorts.
* **Key Requirements**:
  - **Batch CSV/PDF Export**: Download roster and score distributions for career fair prep.
  - **Cohort Comparison Filters**: Filter metrics by graduation term, target subfield (Software Engineering, Data Science, AI/ML, Systems, Cybersecurity).
  - **Advisor Notes & Action Items**: Allow advisors to leave persistent feedback/notes directly on a student's analysis profile.

### 🤖 4. Tailored Job Matching & Skill Gap Analyzer
* **Goal**: Compare student resumes against specific target job descriptions (e.g. Google SWE, Meta Production Engineer, local tech internships).
* **Key Requirements**:
  - Paste target job description or link.
  - Perform real-time skill delta mapping (Matched Skills vs. Missing Critical Gaps).
  - Re-calculate target job readiness percentage.

---

## ⚠️ Known Gaps & Technical Debt

### 🔐 1. Deployment Manifest & Secret Audit Automation
* **Description**: Ensure all GCP Secret Manager bindings (`NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL`) are automatically verified across all `cloudbuild.yaml` manifests before pushing.
* **Status**: Pre-push script updated in `scripts/run_regression_tests.sh`. Need continuous linting rule for Cloud Build YAML files.

### 🧪 2. E2E UI Automated Testing (Playwright / Cypress)
* **Description**: Add automated end-to-end browser testing for critical student flows (login → upload PDF → view 5-layer analysis → view optimized version).

### ⚡ 3. Gemini API Latency & Streaming UI
* **Description**: Implement response streaming or web sockets for live analysis updates so users see real-time progress for each of the 5 layers during analysis.

---

## 🐛 Bugs & Maintenance Items

- [ ] **React Hook Missing Dependencies**: Clean up minor React Hook `useEffect` dependency warnings across advisor and admin pages.
- [ ] **`<img>` to `<Image />` Next.js Optimization**: Replace standard `<img>` tags in admin/advisor views with Next.js `<Image />` for optimized LCP.
- [ ] **Python SDK Deprecation Cleanup**: Update `google.generativeai` imports to `google.genai` in `backend/app/services/gemini.py` prior to SDK end-of-life.

---

## 📋 Priority Summary Matrix

| Feature / Task | Category | Target Release | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage Student Leaderboard** | Feature | v2.6 | **P0 (High)** | 🚧 **In Progress** |
| **PDF Export for Optimized Resume** | Feature | v2.6 | **P1 (High)** | 📝 Backlog |
| **Cloud Build Secret Manifest Auditing** | Tech Debt | Immediate | **P0 (Critical)** | ✅ Completed |
| **Gemini SDK Upgrade (`google.genai`)** | Tech Debt | v2.6 | **P1 (Medium)** | 📝 Backlog |
| **Job Description Skill Gap Delta** | Feature | v2.7 | **P2 (Normal)** | 📝 Backlog |

