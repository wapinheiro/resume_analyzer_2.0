# Implementation Plan - Resume Analysis Improvements

Improve the resume analysis results by adding explanations to the dashboard, providing detailed layer feedback with referenced text, and replacing the visualizer mock with a clean, text-based optimized version.

## Proposed Changes

### Backend
#### [MODIFY] [analyzer_system.md](file://backend/app/prompts/analyzer_system.md)
Update the JSON schema and instructions to:
- Explicitly define the "6-second label" (professional identity).
- Include "Top 3 Risks" with specific reasons.
- Add `referenced_text` and `layer_feedback` fields to each layer in the `layers` object.
- Ensure the `revised_resume_text` is high-quality markdown.

### Frontend
#### [MODIFY] [dashboard/page.tsx](file://frontend/src/app/dashboard/page.tsx)
- Add info icons/tooltips explaining "Resume Marketability Score" and "Career Profile Identity".
- "Resume Marketability Score (RMS): A quantitative measure of how well your resume mitigates hiring risks for a specific role."
- "Career Profile Identity (CPI): The immediate professional 'bucket' a recruiter places you in within 6 seconds."

#### [MODIFY] [analysis/page.tsx](file:///src/app/analysis/page.tsx)
- Remove the `ResumePreview` (visualizer mock).
- Add a new "The 6-Second Label" section at the top.
- Add a "Top 3 Risks" section.
- Update the feedback panel to display the `referenced_text` for the active layer.
- Display the overall layer feedback.

#### [MODIFY] [optimize/page.tsx](file://frontend/src/app/optimize/page.tsx)
- Replace `OptimizedResumePreview` with a formatted markdown viewer for `revised_resume_text`.
- Keep the split view but ensure the text version looks premium (modern typography, proper spacing).

### Documentation
#### [REVIEW]
- Audit existing documentation in `docs/` for outdated screen descriptions or features.
- Update `README.md` if necessary to reflect the improved analysis features.

### DB & Schema Alignment
#### [MODIFY] [analysis.py (Model)](file://backend/app/models/analysis.py)
- Rename `top_errors` column to `top_risks`.
#### [MODIFY] [analysis.py (Schema)](file://backend/app/schemas/analysis.py)
- Update `AnalysisBase` to use `top_risks: Optional[List[Dict[str, str]]]`.
#### [MODIFY] [analyze.py](file://backend/app/api/v1/endpoints/analyze.py)
- Update mapping to use `top_risks=analysis_data.get("top_risks", [])`.
#### [NEW] [Alembic Migration](file://backend/alembic/versions/...)
- Rename `top_errors` to `top_risks` in `analyses` table.

## Verification Plan

### Automated Tests
- Run `pytest` to ensure backend still returns valid JSON (need to update MOCK if tests rely on it).
- I'll check for existing tests in `backend/tests`.

### Manual Verification
1. Upload a resume and verify the Dashboard shows tooltips/explanations.
2. Navigate to Detailed Analysis:
    - Verify "6-Second Label" and "Top 3 Risks" are visible.
    - Verify layer feedback shows the text snippet it's referencing.
3. Navigate to The Vision (Optimized):
    - Verify the resume is displayed as formatted text, not an image/mock.
4. Verify all updated documentation matches the new implementation.
