# Demo Session Review - Feb 18, 2026

This document tracks feedback and proposed improvements from user demo sessions.

---

## 1. Home Page: The "Unmistakable" Entry Point

### Problem
- **Paradox of Choice**: Users try to click the disabled "Analyze My Resume" button and get stuck.
- **Navbar Trap**: New users click "Dashboard," which leads to an empty/incorrect state.
- **Visual Overload**: The terminal header and multiple buttons distract from the primary action.

### Recommendation
1. **Simplify Navigation**: Hide "Dashboard" from the Navbar for users without existing analysis data.
2. **Remove Visual Noise**: Strip the terminal illustration header to prioritize functionality.
3. **Single-Action Hero**: Merge the Upload box and Analyze button into one central "Mega-Button." Clicking it opens the file picker, and selecting a file starts the analysis immediately.

#### Wireframe (Proposed)
```text
[ Navbar: Logo ............................. Login ]

       RESUME ANALYZER 2.0
       Optimize for the 2026 CS Market.

       +-----------------------------------------+
       |                                         |
       |       UPLOAD YOUR RESUME (PDF)          |
       |       To Start Detailed Analysis        |
       |                                         |
       |       [ SELECT FILE ]                   |
       |                                         |
       +-----------------------------------------+

       "making weak things become strong"
```

---

## 2. Actionable Fixes: Redundant Feedback

### Problem
The "Actionable Fixes" section displays the same text twice because the code falls back to the `fix` field when a `reason` is missing.

### Recommendation (Separation of Concerns)
Provide higher-signal feedback by separating the **Rationale** (Why) from the **Action** (How).

1. **Backend**: Update the JSON schema for `issues` to include a `reason` field.
2. **Frontend**: Update the UI to display the `reason` as the body text and the `fix` inside the dedicated "Recommended Action" box.

#### Wireframe (Proposed)
```text
[ LACK OF CAR FORMULA ]
Your bullets currently focus on responsibilities rather than achievement. 
Recruiters need to see quantitative proof of your engineering impact.

+-----------------------------------------+
| RECOMMENDED ACTION                      |
| Rephrase to: 'Redesigned office website 
| using [TechStack], resulting in 20%...' |
+-----------------------------------------+
```

---

## 3. Optimized Version: Bold Text Not Rendering

### Problem
In the Optimized Version page, inline bold markers (`**text**`) are displayed as raw characters instead of being rendered as bold. This affects list items (e.g., `**Languages:**`, `**emotion vectors**`) and makes the resume look broken.

### Root Cause
The custom `MarkdownViewer` component in `optimize/page.tsx` only applies bold parsing to plain paragraph lines. List items (`- ` / `* `) are rendered as plain text strings with no inline style processing.

```tsx
// Current — no bold parsing for list items
if (line.startsWith('- ')) return <li>{line.substring(2)}</li>;
```

### Recommendation
Extract a shared `renderInline(text)` helper that parses `**...**` into `<strong>` tags and apply it to **all** block types: paragraphs, list items, and headers.

#### Wireframe (Proposed Fix)
```text
TECHNICAL SKILLS
• Languages: Python (Advanced), Java, JavaScript...   ← bold label rendered
• Frameworks: React, Node.js, PyTorch...              ← bold label rendered
```
*(The `**` markers are stripped and replaced with proper bold styling)*

---

## 4. Optimized Version: Button Audit & PDF Download

### Button Inventory

| Button | Status | Analysis |
|--------|--------|----------|
| `← Back` | ✅ Works | Links to `/analysis` correctly |
| `Copy All Changes` | ❌ Broken | No `onClick` handler. Redundant with `[COPY MARKDOWN]`. **Remove.** |
| `Download Optimized PDF` | ❌ Broken | No `onClick` handler. Highest-value action on the page. **Implement.** |
| `[COPY MARKDOWN]` | ✅ Works | Copies raw markdown to clipboard |

### UX Problem: Markdown is not student-friendly
`[COPY MARKDOWN]` is a developer-centric action. BYU CS students don't know where to paste raw markdown — their mental model is "I want a Word doc or PDF I can attach to a job application."

### Recommendation

**Short-term**: Replace `[COPY MARKDOWN]` with `[COPY AS PLAIN TEXT]` — strip all `**`, `#`, `-` markers before copying. Works in Google Docs, Word, Overleaf with zero friction.

**This cycle (Priority)**: Implement **PDF Download** using `html2canvas` + `jsPDF` to snapshot the rendered white resume panel. This is the real end-state students need — one click, ready to submit.

**Remove**: `Copy All Changes` — no clear purpose, no implementation, creates confusion.

---

## 5. Optimized Version: Framing & Trust Problem

### Problem
Students interpreted the "Optimized Version" as *their actual resume, improved* — not as an AI-generated illustration of what a high-RMS resume *could* look like. This is a significant trust and ethics issue: a student might submit the AI-fabricated content (e.g., made-up metrics) to employers.

### Recommendation

**1. Rename the page/section**
- Current: "The Vision" / "Optimized Version (RMS 95+)"
- Proposed: **"What Your Resume Could Look Like"** or **"Illustrative Target State"**

**2. Add a prominent disclaimer banner at the top of the resume panel**
> ⚠️ *This is an AI-generated illustration, not your actual resume. Content in brackets (e.g., `[X]%`) represents estimated or example data. Use this as a structural guide — do not submit as-is.*

**3. Visual differentiation**
Mark fabricated/estimated content inline so it's visually obvious what's real vs. illustrative.

---

## 6. Download: Informed Consent Modal

### Problem
Students want to download the optimized version as a template, but need to understand what they're downloading before it lands in their hands.

### Recommendation: "Informed Consent" Download Flow

**Button label**: Generic **"Download"** (not "Download Optimized PDF" — avoids implying it's submission-ready)

**On click — show a confirmation modal**:
```text
+--------------------------------------------------+
| ⚠️  Before you download                          |
|                                                  |
| This is an AI-generated template based on your  |
| profile — not your actual resume. Some content  |
| (metrics, descriptions) may be illustrative.    |
|                                                  |
| Review and replace any [X] values before        |
| submitting to employers.                         |
|                                                  |
|          [ Cancel ]   [ Download PDF ]           |
+--------------------------------------------------+
```

**User confirms → PDF downloads.** The student makes an active, informed choice.

---

## 7. Color Scheme: Align with BYU Brand

### Problem
The current app uses a generic "tech startup" dark blue/purple palette that doesn't reflect BYU's identity. Students and faculty expect a tool that feels like it belongs to BYU.

### BYU Official Brand Colors (Source: byu.edu)

| Role | Color | Hex |
|------|-------|-----|
| Primary (dominant) | Navy | `#002E5D` |
| Secondary | Royal Blue | `#0047BA` |
| Accent | Light Blue | `#BDD6E6` |
| Background (digital) | Dark Gray | `#141414` |
| Text | White | `#FFFFFF` |

### Current vs. Proposed Token Mapping

| CSS Token | Current | Proposed |
|-----------|---------|----------|
| `--primary` | `#2563eb` (generic blue) | `#0047BA` (BYU Royal Blue) |
| `--background` | `#0f172a` (near-black) | `#141414` (BYU Dark Gray) |
| `--surface` | `#1e293b` | `#002E5D` tinted dark panel |
| Text gradient | Blue → Purple | Royal Blue → Light Blue |
| Glow/highlight | `#60a5fa` | `#BDD6E6` (BYU Light Blue) |

### Recommendation
Keep the dark theme (BYU's digital guidelines recommend it for readability). **Shift accent colors** to BYU's official palette. This gives the tool a "BYU-branded premium" feel rather than a generic SaaS look — without requiring a full redesign.
