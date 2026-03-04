# Resume Template Compliance Rules (Version 2.5)

These rules define the "Golden Template" standard for BYU Resumes. The analyzer should check the uploaded PDF/text against these constraints.

## 1. Formatting & Layout

### 1.1 Margins
- **Standard:** 0.5 inches to 1.0 inch on all sides.
- **Constraint:** Content must not be too close to the edge (printing safety) nor too narrow (waste of space).

### 1.2 Fonts
- **Accepted Fonts:** Serif (Times New Roman, Garamond, Georgia) or Professional Sans-Serif (Arial, Calibri, Helvetica).
- **Size:**
    - Body text: 10pt - 12pt.
    - Headers: 14pt - 18pt.
    - Name: 18pt - 24pt.

### 1.3 Length
- **Standard:** 1 Page maximum for undergraduates.
- **Exception:** 2+ pages allowed ONLY for extensive experience or graduate/academic CVs (needs a flag or detection).

## 2. Structure & Sections

### 2.1 Required Sections (Strict Order)
1. **Header (Contact Info):**
    - Name, Phone, Email.
    - Optional but encouraged: LinkedIn, Portfolio.
2. **Objective (Optional):**
    - A brief, one-line professional title or objective tailored to the desired role (e.g., "Internship Full Stack Dev with emphasis in AI Agents"). Best used when targeting a specific role.
3. **Executive Summary:**
    - Must use bulleted, bolded categories.
    - Must summarize the entire resume and tell a consistent storyline.
    - Must be strongly tailored to the specific job position being applied to.
4. **Education:**
    - Degree, University (BYU), Graduation Date, GPA (if > 3.0 or specifically required).
    - Must include clubs, relevant leadership positions, and academic awards.
5. **Skills:**
    - Must use bulleted, bolded categories.
6. **Experience/Projects:**
    - Job Title, Company, Dates, Location.
    - Must use bullet points for descriptions.

## 3. Content Style

### 3.1 Bullet Points
- **Constraint:** Experience descriptions must use bullet points, not paragraphs.
- **Length:** Bullets should be 1-2 lines maximum.
- **Formatting:** Consistent indentation and symbol style.

### 3.2 Dates
- **Format:** Month Year (e.g., "Jun 2023") or Season Year (e.g., "Summer 2023").
- **Alignment:** Right-aligned is standard best practice.

## 4. AI Generation Markdown Rules

To guarantee the frontend CSS can perfectly mimic the Golden Template typography, the AI output (`revised_resume_text`) MUST use strict Markdown syntax:
- **Candidate Name:** Must be an H1 Header (`# First Last`)
- **Section Headers:** Must be an H2 Header and **ALL CAPS** (`## EXECUTIVE SUMMARY`, `## EDUCATION`, `## SKILLS`, `## EXPERIENCE`).
- **Employment/Project Headers:** The Title or Role must be bolded (`**Software Engineer Intern** | Pluralsight | ...`).
- **Formatting Elements:** Use standard bold spacing (`**`) for Emphasis and standard asterisks/dashes (`*` or `-`) for bullets.

## TO DO: Refine Rules
- [ ] Define specific disallowed fonts?
- [ ] Define accepted date formats strictly?
