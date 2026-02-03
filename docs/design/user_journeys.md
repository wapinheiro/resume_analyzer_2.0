# User Journey Map - Resume Analyzer 2.0

**Persona**: Alex, a Sophomore/Junior CS Student seeking an internship.
**Goal**: Polish resume to pass ATS filters and impress human recruiters.

**Core UX Principle: "Progressive Disclosure"**
*Show only what is necessary at each step. Avoid the "Wall of Text".*

---

## Journey 0: The "Identity" (Onboarding)
*Alex wants to save his progress and track improvement over time.*

### Flow
1.  **Welcome**: Minimal landing page. "Analyze Resume" (Guest) vs "Login" (Student).
2.  **Authentication**: Alex logs in via BYU SSO (or email).
3.  **Dashboard**: Sees his "Career Profile Identity" (e.g., "Full Stack Developer") and a graph of his RMS progress over the last 3 versions.
    -   *Decluttered UX*: No complex menus. Just "Upload New" and "History".

---

## Journey 1: The "Sanity Check" (Initial Upload)
*Alex has just finished his resume and wants to know if it's "good enough".*

### Flow
1.  **Upload**: Drags and drops `alex_resume_v1.pdf`.
2.  **Processing**: Minimal "Scanning..." animation (showing stages: Parsing -> Identifying -> Scoring).
3.  **The Score**: The dashboard clears and shows:
    -   **Resume Marketability Score (RMS)** (e.g., **62/100**).
    -   **Identity Detected**: "Full Stack Developer" (**Confidence: 85%**).
4.  **The Hook**: "You are in the top 40% of applicants for this role. Fix 3 critical errors to reach top 10%."
5.  **Action**: Alex clicks "View Report" to see details.

---

## Journey 2: The "Diagnosis" (Layer Analysis)
*Alex wants to know what is dragging his score down without being overwhelmed.*

### Flow
1.  **Navigation**: Sidebar shows 5 Layers (Format, Skills, Impact, Story, X-Factor). Indicators show which layer has the most errors.
2.  **Focus Mode**: Alex clicks **"Impact"**. The UI hides everything else.
3.  **Contextual Highlight**: The tool highlights a specific bullet in the visual preview: *"Helped build a web app..."*
4.  **Bite-Sized Feedback**:
    -   *Issue*: "Weak Verb."
    -   *Fix*: "Try 'Engineered' or 'Architected'."
5.  **Resolution**: Alex feels guided, not scolded.

---

## Journey 2.5: The "Vision" (AI Optimized Example)
*Alex is stuck and wants to see what "Good" looks like for HIS experience.*

### Flow
1.  **Action**: Alex clicks "View Optimized Version" (or "Rewrite").
2.  **Generation**: System generates a version with strong verbs, CAR format, and better layout.
3.  **Celebration**: New Score: **78/100**. Confetti animation (subtle).
4.  **Delta View**: "Impact Score: +15 points. You fixed the weak verbs!"

---

## Journey 4: The "Time Travel" (History & Portfolio)
*Alex wants to see his old resume or prove his growth.*

### Flow
1.  **History Tab**: Alex views a timeline of uploads.
2.  **Comparison**: Selects "v1 (Jan 2)" and "v3 (Feb 5)".
3.  **Visual Diff**: System shows side-by-side comparison of the improvements (e.g., "Added metrics to 3 projects").

---

## Journey 5: The "Targeted Attack" (Job Match)
*Future Feature (v1.1+).*
*Alex is applying to a specific role.*

### Flow
1.  **Job Paste**: Alex pastes a Job Description.
2.  **Gap Analysis**: System warns: "Missing 'Distributed Systems' keyword."
3.  **Action**: Suggests where to add it based on his valid skills.

---

## Gap Analysis vs Requirements
*   **User Management** (FR-13): added in **Journey 0 & 4**.
*   **Reporting** (FR-12): "View Report" step in Journey 1.
*   **Job Matching** (FR-11): Covered in Journey 5.
*   **Export**: Implicit in the "Optimization Loop", but added requirement to "Download PDF Report".
