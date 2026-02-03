# API Specification - Resume Analyzer 2.0

## Overview
This document details the REST API endpoints for the Resume Analyzer 2.0.
**Base URL**: `/api/v1`

---

## Endpoints

### 1. Analyze Resume
Uploads a PDF and triggers the AI analysis pipeline.

- **URL**: `/resumes/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

#### Request Body
| Key | Type | Description |
| :--- | :--- | :--- |
| `file` | File (PDF) | The resume PDF file to analyze. |

#### Response (200 OK)
Returns the created `Analysis` object with the AI results.

```json
{
  "id": "uuid-string",
  "resume_id": "uuid-string",
  "rms_score": 85,
  "cpi": "Senior Software Engineer",
  "predicted_grad_date": "May 2018",
  "skills_detected": ["Python", "React", "AWS"],
  "top_errors": ["Missing Quantifiable Impacts"],
  "raw_json": {
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "cpi": "Senior Software Engineer",
    "rms_score": 85,
    "layers": {
        "format": { "score": 9, "status": "excellent", "issues": [] }
    }
  },
  "created_at": "2026-02-03T18:00:00Z"
}
```

#### Error Responses
- **400 Bad Request**: If the file is not a PDF.
- **500 Internal Server Error**: If the AI service fails or database error occurs.

---

### 2. (Planned) Get Analysis
Retrieve a specific analysis by ID.

- **URL**: `/analyses/{id}`
- **Method**: `GET`
```
