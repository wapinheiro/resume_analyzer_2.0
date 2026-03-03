# Quality Assurance Test Script: Phase 3 (Analysis Improvements)

**Component:** AI Analysis Engine & Frontend Visualization
**Version:** 2.5
**Date:** March 2026

This test script validates the successful implementation of the Phase 3 features: Signal Strength generation, Fabricated Content Legends, and Highlighted Example Actions.

---

## Pre-requisites
1. The backend service (`resume-analyzer-backend`) is running or deployed.
2. The frontend service (`resume-analyzer-frontend`) is running or deployed.
3. You have a sample resume PDF ready for upload (preferably one with a mix of technical skills to trigger the 6-Second Scan).

---

## Test Case 1: End-to-End Analysis Generation
**Objective:** Verify that analyzing a new resume successfully extracts the new JSON fields (`confidence_score` and `confidence_reasoning`) without breaking the existing pipeline.

**Steps:**
1. Navigate to the application root (`/`).
2. Upload the sample resume PDF and click **Upload Resume to Begin**.
3. Wait for the analysis to complete.
4. **Expected Result:** The application should successfully redirect to the `/analysis` page without any 500 errors or parsing failures.

---

## Test Case 2: Signal Strength Visual Rendering
**Objective:** Verify that the "6-Second Scan" block correctly visualizes the AI's confidence score and reasoning.

**Steps:**
1. On the `/analysis` page, locate the **"The 6-Second Label"** card at the top left.
2. Verify that a colored badge (Green, Yellow, or Red) appears in the top right of the card reading `Signal: [Score]/100`.
3. Hover your mouse over the Signal badge.
4. Verify that the browser tooltip displays the AI's reasoning for that score.
5. Check the bottom of the card.
6. **Expected Result:** A sub-text line reading `AI Reasoning: [Explanation text]` should be visible below the CPI label.

---

## Test Case 3: Fabricated Content Legend
**Objective:** Verify that the UI clearly explains the AI's annotation syntax to the user.

**Steps:**
1. On the `/analysis` page, scroll to the bottom of the right-hand panel (below the actionable fixes).
2. Look for the **"Annotation Legend"** block.
3. **Expected Result:** Two distinct legend items should be visible:
   - `[X] = Replace with your specific numerical data.`
   - `[*] = Illustrative technical example to emulate.`

---

## Test Case 4: Actionable Highlights Parsing
**Objective:** Verify the frontend correctly parses and highlights words starting with `*` inside the Recommended Actions.

**Steps:**
1. On the `/analysis` page, select the **Core Spec** or **Impact** layer from the left sidebar to find detailed technical feedback.
2. Look inside the green **"Recommended Action"** boxes.
3. Identify any words that the AI generated with an asterisk prefix (e.g., `*React`, `*Managed`).
4. **Expected Result:** The asterisk should be stripped from the word, and the word itself should be rendered inside a distinct Amber/Yellow pill/badge (e.g., `<span class="bg-amber-100 text-amber-800...">React</span>`).

---

## Test Case 5: Cloud Deployment Verification
**Objective:** Confirm these features work in the live environment, independent of local SQLite databases.

**Steps:**
1. Navigate to the live Cloud Run URL: `https://resume-analyzer-frontend-87294979859.us-central1.run.app`
2. Perform Test Cases 1 through 4.
3. **Expected Result:** All UI elements and backend parsing functions perform identically to the local development environment.
