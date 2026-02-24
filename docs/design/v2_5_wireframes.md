## 5. Advisor Dashboard (Journey 5) - v2.5
*Goal: Allow Career Advisors to manage and review all student analyses.*
*Route: `/advisor/dashboard`*

```text
+---------------------------------------------------------------+
|  RA 2.0       [ Advisor Dashboard ]               (Admin Icon)|
+---------------------------------------------------------------+
|                                                               |
|   [ Overview Analytics ]                                      |
|   +----------------+-------------------+------------------+   |
|   | Avg RMS Score  | Total Scans (30d) | Top Missing Skill|   |
|   |      72        |        142        | System Design    |   |
|   +----------------+-------------------+------------------+   |
|                                                               |
|   All Students                                                |
|                                                               |
|   [ Search by Name or Email...       ] [ Filter: status v ]   |
|                                                               |
|   +-------------------------------------------------------+   |
|   | Name          | Last Scan | Score | Status      | Act |   |
|   +---------------+-----------+-------+-------------+-----+   |
|   | Alex Chen     | 2 hrs ago |  62   | [Follow-up] |  >  |   |
|   | Sam Smith     | Yesterday |  84   | [Reviewed ] |  >  |   |
|   | Taylor Doe    | Jan 22    |  45   | [Pending  ] |  >  |   |
|   | Jordan Lee    | Jan 20    |  91   | [Reviewed ] |  >  |   |
|   +-------------------------------------------------------+   |
|                                                               |
|      < Previous Page   [1] [2] [3]   Next Page >              |
|                                                               |
+---------------------------------------------------------------+
```

---

## 6. Advisor: Student Analysis View (Journey 6) - v2.5
*Goal: Provide the Advisor a read-only, deep-dive view into a specific student's analysis.*
*Route: `/advisor/student/[id]`*

```text
+---------------------------------------------------------------+
|  < Back to Dashboard   |   Student: Alex Chen                 |
+-------------------+-------------------------------------------+
|  LAYERS           |  PREVIEW & ANALYSIS (Read-Only)           |
|                   |                                           |
|  1. Format    (✓) |  EXPERIENCE                               |
|  2. Skills    (✓) |                                           |
|  3. Impact    (2) |  • Software Intern, Google                |
|  4. Story     (1) |    [!] Worked on the backend system       |
|  5. X-Factor  (0) |        using Python and Django.           |
|                   |                                           |
+-------------------+-------------------------------------------+
|  FEEDBACK GENERATED FOR STUDENT                               |
|  [!] Weak Action Verb                                         |
|  Critique: "Worked on" is passive.                            |
|  Suggested Fix: "Architected" or "Developed".                 |
|                                                               |
|  [ Download PDF ]                                             |
+---------------------------------------------------------------+
```

---

## 7. Scheduler Link CTA (Student View Update) - v2.5
*Goal: Enable students to act on their feedback by speaking to an expert.*
*Route: `/analysis/[id]`*

```text
+---------------------------------------------------------------+
|  < Back to Dashboard           Resume: alex_v1.pdf            |
+-------------------+-------------------------------------------+
|                   |                                           |
|      ...          |                  ...                      |
|                   |                                           |
+-------------------+-------------------------------------------+
|                                                               |
|  +---------------------------------------------------------+  |
|  | 🎓 Want expert advice on these results?                 |  |
|  | [ Schedule an Appointment with a Career Advisor ]       |  |
|  +---------------------------------------------------------+  |
|                                                               |
+---------------------------------------------------------------+
```

---

## 8. Advisor Analytics: Score Evolution (Journey 8)
*Goal: Detailed report showing how student scores are trending over time.*
*Route: `/advisor/analytics/scores`*

```text
+---------------------------------------------------------------+
|  < Back to Dashboard   |   Report: Average RMS Score Trend    |
+---------------------------------------------------------------+
|                                                               |
|  Filters: [ All Majors v ]  [ All Grad Years v ]              |
|                                                               |
|    100 |                                                      |
|        |                                  o--o                |
|     80 |                          o--o---/    \               |
|        |                  o--o---/             \o             |
|     60 |          o--o---/                                    |
|        |  o--o---/                                            |
|     40 |---------------------------------------------------   |
|         Sep     Oct      Nov      Dec      Jan      Feb       |
|                                                               |
|  Insight: Scores typically dip during midterms, and peak      |
|  right before the Winter Career Fair.                         |
+---------------------------------------------------------------+
```

---

## 9. Advisor Analytics: Scan Volume (Journey 9)
*Goal: Detailed report showing usage and seasonality.*
*Route: `/advisor/analytics/volume`*

```text
+---------------------------------------------------------------+
|  < Back to Dashboard   |   Report: Scan Volume Seasonality    |
+---------------------------------------------------------------+
|                                                               |
|  Filters: [ All Majors v ]  [ All Grad Years v ]              |
|  Grouping: ( Day ) ( Week ) [ Month ] ( Semester )            |
|                                                               |
|   500 |                                                       |
|       |                                 [||]                  |
|   400 |                                 [||]                  |
|       |                         [||]    [||]                  |
|   300 |                 [||]    [||]    [||]                  |
|       |                 [||]    [||]    [||]          [||]    |
|   200 |                 [||]    [||]    [||]          [||]    |
|       |         [||]    [||]    [||]    [||]          [||]    |
|   100 | [||]    [||]    [||]    [||]    [||]          [||]    |
|       +----------------------------------------------------   |
|         Sep     Oct      Nov      Dec      Jan      Feb       |
|                                                               |
|  Legend: [||] Total Scans                                     |
+---------------------------------------------------------------+
```

---

## 10. Advisor Analytics: Skills Gap (Journey 10)
*Goal: Detailed report showing the most frequent missing skills identified by the AI.*
*Route: `/advisor/analytics/skills`*

```text
+---------------------------------------------------------------+
|  < Back to Dashboard   |   Report: Missing Skills Frequency   |
+---------------------------------------------------------------+
|                                                               |
|  Filters: [ All Majors v ]  [ All Grad Years v ]              |
|  View:    [ Word Cloud View ]  ( Table View )                 |
|                                                               |
|       DOCKER     kubernetes    cloud architecture             |
|                                                               |
|  SYSTEM DESIGN          react.js         CI/CD                |
|                                                               |
|      agile       PYTHON         node.js       git             |
|                                                               |
|  ---------------------------------------------------------    |
|  Top 5 Missing Skills:                                        |
|  1. System Design (Found missing in 42% of resumes)           |
|  2. Docker / Containers (Found missing in 38% of resumes)     |
|  3. Python (Found missing in 25% of resumes)                  |
|  4. CI/CD Pipelines (Found missing in 18% of resumes)         |
|  5. React.js (Found missing in 15% of resumes)                |
+---------------------------------------------------------------+
```
