# Technical Specification: Phase 3 (Analysis Improvements)

## Objective
Refactor the LLM prompts and backend processing to support Signal Strength, full layered feedback lists, and fabricated content markers.

## 1. Prompt Engineering (Backend: `app/prompts/`)

### 1.1 Signal Strength (6-Second Scan)
*   **File:** `scanner_prompt.py` (or equivalent).
*   **Update:** Ask the LLM to provide a `confidence_score` (Integer 0-100) and `confidence_reasoning` (String) alongside the detected Career Identity.
*   **Format:** Ensure the output is enforced as strict JSON.

### 1.2 Deep Layered Feedback
*   **File:** `evaluation_prompt.py` (or equivalent).
*   **Current State:** Limits feedback to one primary issue per layer (Impact, Format, etc.).
*   **Update:** 
    *   Instruction to "Analyze the entire document iteratively."
    *   Return a JSON Array of objects for *each* layer.
    *   Object structure required: `{"original_text": "...", "issue": "...", "recommendation": "...", "example_rewrite": "..."}`.

### 1.3 Fabricated Content Styling & Action Examples
*   **File:** `rewrite_prompt.py` (or equivalent).
*   **Update:** Explicit system instructions:
    *   "When suggesting a rewrite that requires specific numerical data the candidate must provide, use the `X` character."
    *   "When suggesting illustrative text or technical skills as an example, prepend the word with an asterisk `*`."

## 2. Database & Schema Updates

### 2.1 Update Pydantic Schemas (`app/schemas/analysis.py`)
*   Update the models to accept lists of feedback objects rather than single strings/objects per layer.
*   Add `signal_strength_score` and `signal_strength_reason` to the schema.

### 2.2 Update SQLAlchemy Models (`app/models/analysis.py`)
*   Since most feedback is currently stored in a `JSON` column (`skills_detected`, `top_risks`, `raw_json`), the database schema might not need structural changes, but the *typing* of what goes into those JSON blobs will change. Ensure data migrations or backwards compatibility handlers are in place for older `raw_json` formats.

## 3. Frontend UI Updates

### 3.1 Signal Strength UI
*   Update the 6-Second Scan component to display a visual gauge or badge (e.g., Red/Yellow/Green based on the 0-100 score) next to the detected identity.
*   Include a tooltip or expandable section for the `confidence_reasoning`.

### 3.2 List Rendering for Layers
*   Refactor the Layered Feedback component to iterate (`.map()`) over the new array of feedback objects.
*   Ensure each feedback item clearly displays the "Example Rewrite".

### 3.3 Legend Component
*   Create a small UI Legend overlay or footer near the suggested rewrites explaining:
    *   `[X]` = Placeholder for your specific data.
    *   `[*]` = Illustrative example.
