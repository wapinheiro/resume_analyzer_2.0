# Resume Analyzer 2.0 - Deprioritized & Out-of-Scope Archive

This document tracks features, requirements, and ideas that were considered but ultimately pulled from the active implementation roadmap.

## 1. Resume Comparison View
**Original Concept**: A side-by-side historical tracking feature to visually diff two versions of a student's resume and highlight RMS score improvements.
**Reason for Archiving**: Pulled back to simplify the core user experience and limit frontend complexity. May revisit in a distant future version, but not currently requested.

## 2. Token Efficiency Monitoring
**Original Concept**: Track `prompt_tokens` and `completion_tokens` from the Gemini API and persist them to the database to forecast costs.
**Reason for Archiving**: Decided that this is better suited as a generic, standalone tool or middleware that can be used across *every* AI project, rather than being tightly coupled to the Resume Analyzer's specific business logic.

## 3. Job Matching Engine
**Original Concept**: Tie the identified 6-second label (Career Profile Identity) to real job APIs (LinkedIn, Indeed) to serve live job recommendations on the dashboard.
**Reason for Archiving**: Too complex for the current scope. This should be a distinct tool/project entirely.

## 4. Deep Scheduler Integration
**Original Concept**: Automatically pass the AI's "Proposed Questions/Actions" as pre-filled URL parameters or API payloads into the Acuity intake forms.
**Reason for Archiving**: Simplified to just use a static hyperlink to a specific Acuity calendar.
