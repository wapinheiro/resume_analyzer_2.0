# Technical Specification: Phase 2 (Core Advisor Features)

## Objective
Build the restricted routing and views for Career Advisors, allowing them to view student analyses and enabling students to schedule appointments.

## 1. Backend API Endpoints (FastAPI)

### 1.1 Advisor Routes (`/api/advisors/*`)
*   **GET /advisors/students:** Returns a paginated list of all users with role='student' and their most recent analysis score/date.
    *   *Security:* Must verify JWT and assert `role == 'advisor'` or `'admin'`.
*   **GET /advisors/students/{user_id}/analyses:** Returns the analysis history for a specific student.
    *   *Security:* Advisor only.

## 2. Frontend Application (Next.js)

### 2.1 Route Protection & Middleware
*   Implement Next.js Middleware (`middleware.ts`) to protect the `/advisor/*` routes.
*   Check the NextAuth JWT token; if `token.role !== 'advisor'`, redirect to the homepage or a 403 Access Denied page.

### 2.2 Advisor Dashboard (`/advisor/dashboard`)
*   **Student List Viewer:** A data table component displaying:
    *   Student Name & Email
    *   Last Scan Date
    *   Latest RMS Score
    *   Action button: "View Analysis"
*   **Filters:** Add basic text search (by email/name) and sort by date/score.

### 2.3 Advisor Detail View (`/advisor/student/[id]`)
*   A read-only rendering of the standard Analysis Result page.
*   Requires fetching data from the new `GET /advisors/students/{user_id}/analyses` backend endpoint.

### 2.4 Scheduler CTA (Student View)
*   On the `/analysis/[id]` page (when viewed by a Student).
*   Add a prominent UI Banner/Button: "Discuss these results with a Career Advisor".
*   **Link:** Hardcode (via ENVs) to the Acuity Scheduling URL. 
*   *Future proofing:* Ensure the button component can easily accept URL parameters later.
