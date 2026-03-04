# Version 2.5: Advisor Platform & Enhanced Analysis Requirements

## 1. Overview
Version 2.5 transforms the Resume Analyzer from a standalone student tool into a comprehensive Career Services Platform. It introduces an Advisor interface, mandatory student accounts, and deeper analysis capabilities.

## 2. Feature Priority Matrix

| Feature | Priority | Complexity | Status |
| :--- | :--- | :--- | :--- |
| **User Accounts (NextAuth)** | **Critical** | Medium | Planning |
| **Advisor Portal / Dashboard** | **High** | High | Planning |
| **Scheduler Link (Button)** | **High** | Low | Planning |
| **Complete Scheduler Integration** | Backlog | High | Pending |
| **Template Compliance Check** | **High** | Medium | Planning |
| **Signal Strength (6-sec scan)**| Medium | Low | Planning |
| **Deep Layered Feedback** | Medium | High | Planning |
| **Fabricated Content Styling** | Low | Low | Planning |
| **Action Examples** | Low | Low | Planning |
| Token Efficiency | Backlog | Medium | Pending |

## 3. Core Features

### 3.1 Advisor Bridge
- **Admin/Advisor Portal:**
    - A dedicated dashboard for Career Advisors.
    - View list of all student analyses (searchable/filterable by name, date, major).
    - drill-down view into specific student analysis results.
    - View proposed questions and action items generated for each student.
- **Advisor Dashboard Metrics:**
    - Aggregate analytics (e.g., common missing skills across all students, average scores).
    - Status tracking for follow-ups and check-ins.
- **Student-Advisor Scheduling:**
    - **Simple Integration (v2.5):** Add a prominent "Schedule with Advisor" button that links directly to the Acuity Scheduling portal.
    - **Backlog:** Deep integration with pre-filled forms.

### 3.2 User Accounts & Authentication (Provider-Agnostic Strategy)
- **Framework:** Use **NextAuth.js (Auth.js)** as an abstraction layer in the Next.js frontend.
- **Temporary Implementation (v2.5):** Implement Google OAuth and/or GitHub OAuth using NextAuth's built-in providers. This allows students to securely log in using existing accounts, automatically creating rows in our PostgreSQL database without us touching passwords or committing to a paid auth service.
- **Future State:** Because NextAuth abstracts the specific provider, once BYU's cloud requirements (AWS Cognito, Google Workspace, Azure AD) are understood, we can swap out the NextAuth provider with 5 lines of code, keeping the database and frontend logic exactly the same.
- **Database:** Create a `users` table directly in the existing PostgreSQL database to store user IDs and Roles (Student vs. Advisor), eliminating third-party vendor lock-in for user data.

## 4. Analysis Enhancements

### 4.1 Signal Strength (6-Second Scan)
- The "6-Second Scan" output must include a **Signal Strength** metric (e.g., Weak, Moderate, Strong).
- **Metric Definition:**
    - How easy is it for a recruiter to identify the target role?
    - How confident is the recruiter in this identification?
- **Implementation:** Update prompts to output a score (0-100) or classification along with reasoning.

### 4.2 Layered Feedback Depth
- **Current Limitation:** Feedback only cites one line/extract per layer.
- **Requirement:**
    - Analyze the *entire* document for each layer.
    - Return a list of *all* relevant extracts/lines that need improvement for that specific layer.
    - Do not limit to just the "top" finding.

### 4.3 Recommended Actions Context
- **Requirement:** Every recommended action must include a concrete **Example**.
    - *Bad:* "Use more active verbs."
    - *Good:* "Use more active verbs. Example: Change 'Responsible for managing' to 'Managed' or 'Orchestrated'."

### 4.4 Fabricated Content Formatting
- **Constraint:** Use specific markers to denote placeholder/fabricated data types.
    - `X`: Use for specific numerical values (e.g., "Improved efficiency by X%").
    - `*`: Use for illustrative text/examples (e.g., "Languages: *Python, *Java").
- **UI:** Add a legend/note explaining what `*` and `X` represent in the rewritten text.

### 4.5 Golden Template Enforcement
- **New Feature:** Ensure that the AI-generated "Optimized Version" natively conforms to the strictly defined "Golden Template" (e.g., specific section ordering, bolded subcategories).
- **Implementation:** Inject structural constraints from `resume_template_rules.md` directly into the LLM prompt, and enforce corresponding physical spacing and typography in the frontend via CSS classes.

## 5. Impact Analysis & Risks

### 5.1 System Design & Architecture
- **State Management (Frontend):** Moving from ephemeral (session-based) data to persistent (user-based) data will require integrating NextAuth's `useSession` hooks to manage global authentication state and ensure data fetching is authorized.
- **Routing:** Access to the `/advisor` routes and specific student analyses must be strictly protected based on the user's Role. This introduces intermediate layout/middleware complexity in Next.js.
- **API Contracts:** The backend FastAPI endpoints will need to be updated to accept and validate the JWTs issued by NextAuth over the API headers.

### 5.2 Database
- **Schema Migration:** 
    - A new `users` table must be created in PostgreSQL.
    - The `resumes` and potentially `analyses` tables will need a new foreign key (`user_id`) linking records to the `users` table.
    - We must create an Alembic migration script to apply these changes.
- **Data Integrity Risk:** Migrating existing anonymous/session-based data. If an anonymous user later creates an account, how do we link their past analyses? (We may need to temporarily support both `session_id` and `user_id`).

### 5.3 Tech Stack & Third-Party Integrations
- **Authentication Resilience:** By using NextAuth.js and maintaining our own `users` table, we mitigate vendor lock-in. If BYU requires AWS, GCP, or Azure later, the migration effort is restricted strictly to finding the right NextAuth OAuth provider plugin, rather than rewriting the frontend and database.
- **LLM Token Usage:** The "Layered Feedback Depth" requirement (analyzing the whole document instead of single lines) will dramatically increase token usage per scan. We must monitor Google Gemini limits/costs and potentially implement caching or chunking strategies if latency or cost becomes an issue.

## 6. Implementation Roadmap

### Phase 1: Foundation (User Accounts)
1.  **Database & Auth Schema:**
    - Create `users` table in PostgreSQL.
    - Add `user_id` foreign key to `resumes` table.
    - Set up **NextAuth.js** in the frontend with Google/GitHub OAuth providers.
    - Implement JWT verification in FastAPI.
2.  **Migration:**
    - Ensure existing anonymous data is handled (orphaned or claimed).

### Phase 2: Core Advisor Features
1.  **Advisor Dashboard:**
    - Create restricted `/advisor` route.
    - Build "All Students" list view.
    - Build "Student Detail" view (read-only version of analysis page).
2.  **Scheduler Link:**
    - Add "Talk to an Advisor" call-to-action on the analysis result page.

### Phase 3: Analysis Improvements (Prompt Engineering)
1.  **Refactor Prompts:**
    - Update `analysis.py` / `prompts/` to request:
        - Signal Strength Score & Reasoning.
        - Full list of issues per layer (remove "single item" limit).
        - Fabricated content markers (`*`, `X`).
2.  **UI Updates:**
    - Display Signal Strength.
    - Render layered feedback lists.
    - Add "Fabricated Content" legend.

### Phase 4: Golden Template Enforcement
1.  **AI Generation Constraints:**
    - Inject `resume_template_rules.md` structure into the `analyzer_system.md` prompt.
    - Ensure LLM strictly outputs Header -> Summary -> Education -> Skills -> Experience.
    - Force LLM to use bulleted, bolded categories for Summary and Skills.
2.  **Frontend Layout Rendering:**
    - Update `globals.css` with a `.resume-template-view` class.
    - Enforce template typography constraints (10-12pt body, 14-18pt headers, standard margins) when rendering the AI's markdown.

## 7. Backlog / Low Priority
- **Token Efficiency:** Track token usage for cost analysis (internal metric).
- **Deep Scheduler Integration:** API-based booking with pre-filled context.
