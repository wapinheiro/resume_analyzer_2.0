# Wireframes - Resume Analyzer 2.0

**Design Principle**: Progressive Disclosure. Start simple, reveal complexity only when asked.

---

## 1. Landing Page (Journey 0)
*Goal: Converting visitors to users with zero friction.*

```text
+---------------------------------------------------------------+
|  RESUME ANALYZER 2.0                      [Login] [Sign Up]   |
+---------------------------------------------------------------+
|                                                               |
|                                                               |
|          passed_ats_filters = True                            |
|          human_impressed = True                               |
|                                                               |
|       [      Analyze My Resume (Free)      ]                  |
|                                                               |
|    ( Drag & Drop PDF here - No account needed initially )     |
|                                                               |
|                                                               |
+---------------------------------------------------------------+
|  Trusted by students at: [BYU] [MIT] [Stanford]               |
+---------------------------------------------------------------+
```

---

## 2. Dashboard - "The Verdict" (Journey 1)
*Goal: The "Sanity Check". Immediate, high-level feedback. No wall of text.*

```text
+---------------------------------------------------------------+
|  RA 2.0       [ Dashboard ]  [ History ]          (User Icon) |
+---------------------------------------------------------------+
|                                                               |
|   Your Resume Marketability Score (RMS)                       |
|                                                               |
|           +-------+                                           |
|           |  62   |   Needs Improvement                       |
|           +-------+                                           |
|                                                               |
|   Identity Detected: Full Stack Developer (Conf: 85%)         |
|                                                               |
|   ---------------------------------------------------------   |
|   THE HOOK:                                                   |
|   "You are in the top 40%. Fix 3 critical errors              |
|    to reach the top 10%."                                     |
|                                                               |
|            [ View Detailed Report ]                           |
|                                                               |
+---------------------------------------------------------------+
```

---

## 3. Analysis View - "The Deep Dive" (Journey 2)
*Goal: Focused diagnosis. The user selected "View Report".*

```text
+---------------------------------------------------------------+
|  < Back to Dashboard           Resume: alex_v1.pdf            |
+-------------------+-------------------------------------------+
|  LAYERS           |  PREVIEW & ANALYSIS                       |
|                   |                                           |
|  1. Format    (✓) |  EXPERIENCE                               |
|  2. Skills    (✓) |                                           |
|  3. Impact    (2) |  • Software Intern, Google                |
|  4. Story     (1) |    [!] Worked on the backend system       |
|  5. X-Factor  (0) |        using Python and Django.           |
|                   |                                           |
+-------------------+-------------------------------------------+
|  FEEDBACK (Contextual)                                        |
|  [!] Weak Action Verb                                         |
|  Critique: "Worked on" is passive.                        |
|  Fix: Try "Architected" or "Developed".                   |
|                                                               |
|  [ Apply Fix ]  [ Ignore ]                                    |
+---------------------------------------------------------------+
```

---

## 3b. Comparison View (Journey 2.5)
*Goal: Showing the "Golden Version". The "Vision".*

```text
+---------------------------------------------------------------+
|  < Back          Original            vs       Optimized (AI)  |
+---------------------------------------+-----------------------+
|  • Worked on server.                  |  • Engineered server  |
|                                       |    backend, improving |
|                                       |    latency by 20%.    |
|                                       |                       |
|  • Made a React app.                  |  • Developed scalable |
|                                       |    React SPA...       |
|                                       |                       |
|  [ Score: 62 ]                        |  [ Score: 94 ]        |
+---------------------------------------+-----------------------+
|  [ Download Optimized PDF ]   [ Copy All Text ]               |
+---------------------------------------------------------------+
```

---

## 4. History / Comparison (Journey 4)
*Goal: Showing progress.*

```text
+---------------------------------------------------------------+
|  < Dashboard                               History            |
+---------------------------------------------------------------+
|                                                               |
|  [ v3 - Today, 4:00 PM ] -----------------------------> 78    |
|       ^ Fixed "Impact" verbs (+15 pts)                        |
|                                                               |
|  [ v2 - Today, 3:30 PM ] ---------------------> 62            |
|                                                               |
|  [ v1 - Jan 22, 2026   ] ------------> 45                     |
|                                                               |
|  [ Compare v1 vs v3 ]                                         |
|                                                               |
+---------------------------------------------------------------+
```
