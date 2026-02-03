# Project Diary

## Overview
This document records the actual path taken to build **Resume Analyzer 2.0**. It serves as a historical log of decisions, actions, and pivots.

---

## 2026-02-02: Infrastructure & "Always Working" Foundation

### Goal
Establish a robust CI/CD pipeline and live deployment environment before writing any core feature code. This ensures we are always looking at a working version of the application.

### Tasks Completed
1.  **CI/CD Planning**:
    -   Approved plan to use **GitHub Actions** for CI.
    -   Decided on **Vercel** (Frontend) and **Render** (Backend) for the development phase to avoid immediate AWS costs/complexity, while keeping the architecture (Docker) compatible with future AWS migration.

2.  **Project Skeleton Setup**:
    -   Created `backend/` (FastAPI) and `frontend/` (Next.js) directories.
    -   Initialized `requirements.txt`, `package.json`, and `Dockerfile`s for both.

3.  **CI Pipeline Implementation**:
    -   Created `.github/workflows/ci.yml`.
    -   Configured jobs to lint, test, and build both Frontend and Backend on every push.

4.  **Initial Deployment**:
    -   **Frontend**: Deployed to Vercel ([Live Link](https://resume-analyzer-2-0-flax.vercel.app)). Configured "Root Directory" to `frontend`.
    -   **Backend**: Deployed to Render ([Live Link](https://resume-analyzer-2-0.onrender.com)). Configured "Root Directory" to `backend` and used Docker runtime.

5.  **Verification**:
    -   Updated code to display "Resume Analyzer 2.0 - CI/Cd test".
    -   Pushed to GitHub.
    -   Verified that:
        -   GitHub Actions ran successfully.
        -   Vercel automatically deployed the frontend update.
        -   Render automatically deployed the backend update.

### Decisions Log
-   **Pivot to Vercel/Render**: Initially looked at AWS Free Tier. However, due to account access issues and the desire for speed, we chose Vercel and Render for the *Development Phase*. We will migrate to BYU's AWS account for Production.
-   **Monorepo Structure**: Kept both frontend and backend in one repo for simplicity. Configured deployment tools to look in specific subdirectories (`frontend/`, `backend/`).

---

## 2026-02-02: Phase 1 Pivot - UX First

### Decision
Instead of jumping straight into System Architecture (Database/API design), we decided to prioritize **User Experience (UX)**.

### Rationale
We want to validate *what* we are building before we decide *how* to build it. Validating user journeys ensures we don't over-engineer features that students don't need or understand.

### Actions
-   Drafting `docs/design/user_journeys.md`.
-   Creating this Diary.
