# Technical Specification: Phase 4 (Template Compliance)

## Objective
Implement a compliance engine to verify that uploaded resumes adhere to the strict BYU "Golden Template" rules.

## 1. Backend Service (`app/services/pdf_compliance.py`)

### 1.1 PDF Extraction capabilities
*   Evaluate `pypdf` vs `pdfplumber` or `PyMuPDF`. While `pypdf` is currently in `requirements.txt`, verifying physical margins usually requires a heavier library like `pdfplumber` that can extract exact bounding boxes of text.
*   **Decision Needed:** If margin checking is strictly required, install `pdfplumber` (`pip install pdfplumber`).

### 1.2 Rule Engine Implementation
Implement a checking class/function that returns a list of Pass/Fail boolean flags and messages.

*   **Rule 1: Length.** Pass if page count == 1. Wait/flag if page count > 1.
*   **Rule 2: Section Order.** 
    *   Use Regex to find standard headers (Objective, Executive Summary, Education, Skills, Experience).
    *   Compare the found order against the required strict order `[Objective, Executive Summary, Education, Skills, Experience/Projects]`. (Note: Objective is optional).
*   **Rule 3: Margins (If technically viable).** Extract text bounding boxes and ensure the leftmost X coordinate and topmost Y coordinate are >= 0.5 inches (converted to points: 36pts).

### 1.3 LLM Assistance for Structural Compliance
For rules that are difficult to programmatically verify (e.g., "Must use bulleted, bolded categories in Skills"), utilize a lightweight LLM call specifically tasked with template validation against the raw text extraction.

*   **Prompt Request:** Provide the text and the rules, ask for a JSON array of `{"rule": "...", "passed": boolean, "details": "..."}`.

## 2. API & Database

## 2.1 Update Analysis Model
*   Add a `template_compliance_results: JSON` column to the `Analysis` SQLAlchemy model to store the pass/fail results.

## 2.2 Integration
*   Call `pdf_compliance.py` synchronously during the `/resumes/analyze` endpoint flow.

## 3. Frontend Updates

### 3.1 Compliance Badges
*   On the main Analysis page, add a "Template Compliance" card.
*   List the rules checked (e.g., "1 Page Limit", "Section Order", "Margin Safety").
*   Use Green Checkmarks for Pass, Red/Yellow alerts for Fail with the associated failure details.
