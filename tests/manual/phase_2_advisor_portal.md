# Manual Testing Script - Phase 2: Advisor Portal

This document outlines the steps to verify the role-based access control and analytics dashboards built for Career Advisors in Phase 2.

## Prerequisites
Ensure both the frontend (`npm run dev`) and backend (`uvicorn`) are running. You should have already completed the Phase 1 test to create a user account in the database.

## Test Cases

### 1. Verify Role-Based Redirection (Negative Test)
**Goal:** Ensure standard students cannot access the Advisor Portal.
1. Log into `http://localhost:3000` with a standard student account.
2. Attempt to navigate directly to `http://localhost:3000/advisor/dashboard`.
3. **Expected:** You are immediately redirected back to the homepage (`/`) because your JWT does not contain the `advisor` or `admin` role.

### 2. Promote Account to Advisor
**Goal:** Manually elevate your user account via the database to access advisor features.
1. Open a terminal and connect to your local SQLite database:
   ```bash
   cd backend
   sqlite3 sql_app.db
   ```
2. Update your user record (replace with your actual email):
   ```sql
   sqlite> UPDATE users SET role = 'advisor' WHERE email = 'your.email@example.com';
   sqlite> .exit
   ```
3. **Crucial Step:** In your browser, **sign out** of the application and **sign back in**. This forces NextAuth to generate a new JWT containing your newly updated `advisor` role.

### 3. Advisor Dashboard & Roster
**Goal:** Verify the main advisor overview page renders correctly.
1. Navigate to `http://localhost:3000/advisor/dashboard`.
2. **Expected:** The page loads successfully.
3. **Verify UI:**
   - Three analytics summary cards (Avg RMS Score, Total Scans, Top Missing Skill) should populate with data from the `GET /api/v1/advisors/analytics` backend endpoint.
   - The "Student Roster" table should display a list of registered students.
4. **Filter Test:** Type a name or email into the search bar above the roster. Ensure the table updates dynamically to filter the results.

### 4. Drill-Down Analytical Charts
**Goal:** Verify the detailed React Recharts pages load and support filtering.
1. From the dashboard, click the first metrics box (Avg RMS Score).
2. **Scores View (`/advisor/analytics/scores`):** You should see a line chart of score trends and an AI Insight box below it. Test changing the "Major" and "Grad Year" dropdown filters.
3. Click the "← Back to Dashboard" button.
4. Click the second metrics box (Total Scans).
5. **Volume View (`/advisor/analytics/volume`):** You should see a bar chart representing grouping intervals. Test the "Group By" dropdown (e.g., change from Month to Day).
6. Click the "← Back to Dashboard" button.
7. Click the third metrics box (Top Missing Skill).
8. **Skills View (`/advisor/analytics/skills`):** You should see a dynamic Word Cloud of missing skills. Click the "Data Table" toggle button at the top right to verify it switches to a tabular layout mapping skills to percentages.

### 5. Read-Only Student Analysis
**Goal:** Verify an advisor can view a specific student's latest scan results without edit capabilities.
1. Return to `http://localhost:3000/advisor/dashboard`.
2. Find a student in the roster and click the blue **">"** (Action) button on the far right of their row.
3. **Expected:** You are routed to `/advisor/student/[user_id]`.
4. Verify the analysis page renders the student's RMS score, CPI, Top Hiring Risks, and layer-by-layer breakdown.

### 6. Acuity Scheduling CTA (Student View)
**Goal:** Verify the new integration point for students to book appointments.
1. Navigate to any standard student analysis view via `http://localhost:3000/analysis`. (As an advisor, you can still view this generic endpoint or view past specific analyses).
2. Look at the bottom of the left sidebar containing the analysis layers.
3. **Expected:** A button titled **"Discuss with an Advisor"** should be present. Clicking it should open Acuity Scheduling in a new browser tab.
