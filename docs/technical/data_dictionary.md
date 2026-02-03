# Data Dictionary - Resume Analyzer 2.0

## Overview
This document describes the database schema used by the Resume Analyzer 2.0 application.
**Database Engine**: PostgreSQL
**ORM**: SQLAlchemy

---

## Tables

### 1. `resumes`
Stores the metadata for uploaded resume files.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `uuid4()` | Primary Key. Unique identifier for the resume. |
| `session_id` | UUID | Yes | None | Session identifier to group uploads by a transient user session. |
| `client_info` | JSONB | Yes | None | Metadata about the upload (filename, content_type, size). |
| `uploaded_at` | DateTime | No | `utcnow()` | Timestamp of upload. |

**Relationships:**
- One-to-Many with `analyses`.

---

### 2. `analyses`
Stores the AI-generated analysis results for a specific resume.

| Column | Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | No | `uuid4()` | Primary Key. Unique identifier for the analysis. |
| `resume_id` | UUID | No | - | Foreign Key to `resumes.id`. |
| `rms_score` | Integer | Yes | None | Resume Marketability Score (0-100). |
| `cpi` | String | Yes | None | Candidate Persona Identifier (e.g., "Full Stack Developer"). |
| `predicted_grad_date` | String | Yes | None | Extracted or predicted graduation date. |
| `skills_detected` | JSONB | Yes | `[]` | List of skills identified in the resume. |
| `top_errors` | JSONB | Yes | `[]` | List of high-priority errors found. |
| `raw_json` | JSONB | Yes | None | **Full AI Response**. Stores the complete JSON structure returned by Gemini, including detailed layer analysis, candidate name, etc. |
| `created_at` | DateTime | No | `utcnow()` | Timestamp of analysis creation. |

**Relationships:**
- Many-to-One with `resumes`.

---

## JSON Structures

### `analyses.raw_json`
The complete analysis output from Gemini.

```json
{
  "candidate_name": "String",
  "candidate_email": "String",
  "cpi": "String",
  "rms_score": Integer,
  "predicted_grad_date": "String",
  "skills_detected": ["String"],
  "top_errors": ["String"],
  "layers": {
    "format": { "score": Int, "status": "String", "issues": [] },
    "content": { "score": Int, "status": "String", "issues": [] },
    "impact": { "score": Int, "status": "String", "issues": [] }
  }
}
```
