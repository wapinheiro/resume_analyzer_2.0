# Next Phases Implementation Plan

Based on the latest project review, we have restructured the remaining work into distinct phases and archived out-of-scope items (Comparison, Token Tracking, Job Matching).

## Phase 5: Cloud Database & Real Analytics
**Objective**: Transition from local SQLite to a robust Cloud SQL (PostgreSQL) instance in GCP for data persistence, and use that persistent data to power the Advisor Dashboard with real SQL aggregations.

### 5.1 Cloud Database Provisioning (GCP)
1. **Infrastructure**:
    - Deploy a Google Cloud SQL (PostgreSQL 15+) instance.
    - Create a database (`resume_analyzer_db`) and a dedicated user.
    - Secure the connection (require SSL, configure authorized networks or Cloud SQL Auth Proxy).
2. **Environment Configuration**:
    - Update deployment ENVs (`DATABASE_URL`) to point to the new Cloud SQL instance.
3. **Migration Execution**:
    - Run Alembic migrations (`alembic upgrade head`) against the fresh GCP production database to establish `users`, `resumes`, and `analyses` tables.

### 5.2 Advisor Analytics Aggregations
1. **Backend Integration**:
    - Refactor `backend/app/api/v1/endpoints/advisors.py` to replace mocked data.
    - Implement real SQLAlchemy queries using `func.avg()`, `func.count()`, and JSON extraction to query the `top_risks` or `layers` fields.
    - Ensure metrics like "Volume over time" and "Top Missing Skills" accurately reflect the persisted analysis records.

---

## Phase 6: PDF Optimization Export
**Objective**: Generate a highly formatted, physical PDF file with the suggested resume improvements following the Golden Template.

### 6.1 PDF Generation Engine
1. **Backend Endpoint (`/export/pdf`)**:
    - Create a new FastAPI route that takes a specific `Analysis` ID.
2. **Templating & Rendering**:
    - Implement a library like `WeasyPrint` or `ReportLab` to convert the LLM's `revised_resume_text` (markdown) into a physical PDF document.
    - Define a strict HTML/CSS template that enforces the typography, spacing, and order of the BYU Golden Template.
3. **Frontend Integration**:
    - Add a "Download PDF" CTA button on the optimization view that triggers the export endpoint and serves the file download to the user.

---

## Immediate Fixes (Non-Phased)
### Update Acuity Scheduler Link
- Replace the existing CTA URL on the analysis/dashboard views with the exact calendar link:
  `https://app.acuityscheduling.com/schedule/adb4b746/appointment/79892735/calendar/12255014?ref=email`
