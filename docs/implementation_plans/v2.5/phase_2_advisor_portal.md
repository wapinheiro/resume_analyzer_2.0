# Technical Specification: Phase 2 (Core Advisor Features)

## Objective
Build the restricted routing and views for Career Advisors, allowing them to view student analyses and enabling students to schedule appointments.

## 1. Backend API Endpoints (FastAPI)

### 1.1 Advisor Routes (`/api/v1/advisors/*`)
*   **GET /advisors/students:** Returns a paginated list of all users with role='student', their most recent analysis score/date, and their review status (e.g., Pending, Reviewed, Follow-up).
    *   *Security:* Must verify JWT and assert `role == 'advisor'` or `'admin'`.
*   **GET /advisors/students/{user_id}/analyses:** Returns the analysis history for a specific student.
    *   *Security:* Advisor only.
*   **GET /advisors/analytics:** Returns top-level aggregate metrics (average score, top missing skills, total scans).
*   **GET /advisors/analytics/scores:** Returns time-series data of average RMS scores.
    *   *Requirement:* Must accept optional query params for filtering (`major`, `grad_year`).
    *   *Requirement:* Payload must include an `insight` string containing a brief, AI-generated observation about the current score trend.
*   **GET /advisors/analytics/volume:** Returns histogram data of total scans.
    *   *Requirement:* Must accept `group_by` query param (`day`, `week`, `month`, `semester`) to control data buckets.
    *   *Requirement:* Must accept optional filtering params (`major`, `grad_year`).
*   **GET /advisors/analytics/skills:** Returns a frequency map of the most identified missing skills.
    *   *Requirement:* Must accept optional filtering params (`major`, `grad_year`).

## 2. Frontend Application (Next.js)

### 2.1 Route Protection & Middleware
*   Implement Next.js Middleware (`middleware.ts`) to protect the `/advisor/*` routes.
*   Check the NextAuth JWT token; if `token.role !== 'advisor'`, redirect to the homepage or a 403 Access Denied page.

### 2.2 Advisor Dashboard (`/advisor/dashboard`)
*   **Overview Analytics:** Display top-level metrics cards at the top of the dashboard. Ensure each card is clickable and routes to its respective detailed report view (`/scores`, `/volume`, `/skills`).
*   **Student List Viewer:** A data table component displaying:
    *   Student Name & Email
    *   Last Scan Date & Latest RMS Score
    *   Status Badge (e.g., Pending, Follow-up, Reviewed)
    *   Action button: "View Analysis"
*   **Filters:** Add basic text search (by email/name), sort by date/score.

### 2.3 Detailed Analytic Views (`/advisor/analytics/*`)
*   `/scores`: Plot average scores over time using a chart library (e.g., Recharts). Include dropdown menus to apply filters (`Major`, `Grad Year`) and display the returned `insight` text below the chart.
*   `/volume`: Plot scans as a bar chart. Include dropdown filter menus and a toggle menu to change the grouping dimension (`Day`, `Week`, `Month`, `Semester`).
*   `/skills`: Render the top missing skills. Include filter menus and a toggle to switch between `Word Cloud View` (visual) and `Table View` (data-focused).

### 2.4 Advisor Detail View (`/advisor/student/[id]`)
*   A read-only rendering of the standard Analysis Result page.
*   Requires fetching data from the `GET /advisors/students/{user_id}/analyses` endpoint.

### 2.5 Scheduler CTA (Student View)
*   On the `/analysis/[id]` page (when viewed by a Student).
*   Add a prominent UI Banner/Button: "Discuss these results with a Career Advisor".
*   **Link:** Hardcode (via ENVs) to the Acuity Scheduling URL. 
*   *Future proofing:* Ensure the button component can easily accept URL parameters later.
