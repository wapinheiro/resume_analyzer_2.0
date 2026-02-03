# System Architecture - Resume Analyzer 2.0

## 1. High-Level Overview
Resume Analyzer 2.0 is a cloud-native web application designed to provide instant, AI-powered resume feedback. It follows a decoupled **Client-Server** architecture, leveraging **Next.js** for the frontend and **FastAPI** for the backend, with **Google Gemini** as the intelligence engine.

### Key Principles
1.  **Statelessness**: The backend is stateless; all state is managed via the Database or Client tokens.
2.  **Security First**: FERPA compliance dictates strict data handling (encryption, retention policies).
3.  **Scalability**: Containerized backend (Docker) allows horizontal scaling on serverless platforms (Render/AWS).

---

## 2. Component Diagram

```text
[Student User]
      |
      | HTTPS
      v
[Frontend (Next.js)]
      |
      | REST API / JSON
      v
[Backend API (FastAPI)]
      |
      +---> [PDF Parser] (Extract Text)
      |
      +---> [S3 Bucket] (Store Temp PDF)
      |
      +---> [Gemini Wrapper] --(API Call)--> [Google Gemini 1.5 Pro]
      |
      +---> [PostgreSQL] (Read/Write Analysis)
```

---

## 3. Technology Stack

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** (App Router) | React-based, SEO friendly. Includes **Animated CLI Components** for "Tech-Native" UX. |
| **Backend** | **Python 3.10 + FastAPI** | High performance, native async support, excellent AI/ML ecosystem. |
| **Database** | **PostgreSQL 15+** | Relational integrity. **JSONB** column heavily used for flexible `layers` analysis data. |
| **AI Model** | **Google Gemini 1.5 Pro** | Huge context window (1M tokens) allowing full resume + ruleset analysis. Cost-effective. |
| **ORM** | **SQLAlchemy + Pydantic** | Strong typing and data validation. |
| **Migrations** | **Alembic** | Version controlled database changes. |

---

## 4. Data Flow: The "Analysis Loop"

1.  **Submission**: User uploads `resume.pdf` to Frontend.
2.  **API Request**: Frontend sends `POST /api/v1/analyze` with `FormData` to Backend.
3.  **Validation**: Backend validates file type (PDF/DOCX) and size (<10MB).
4.  **Storage (Temp)**: File is uploaded to S3 (encrypted bucket) with a lifecycle policy (delete after 30 days).
5.  **Extraction**: `pypdf` or `LlamaParse` reads the file and extracts raw text.
6.  **Intelligence**:
    *   Backend constructs a **Prompt** containing:
        *   Raw Resume Text.
        *   The "Layered Analysis Framework" rules (System Prompt).
        *   Desired JSON Output Schema.
    *   Sends to Gemini API.
7.  **Processing**: Gemini generates the `AnalysisResult` JSON.
8.  **Persistence**: Backend saves the JSON to the `analyses` table in PostgreSQL.
9.  **Response**: Backend returns the JSON to Frontend.
10. **Rendering**: Frontend parses JSON and displays the Dashboard (Journey 1).

---

## 5. Data Schema (Anonymous Analytics)

> [!NOTE]
> We do NOT store User Accounts. All analysis is anonymous. Data is persisted solely for CS Department analytics (e.g., "What skills are students missing?").

### `resumes` table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `session_id` | UUID | Browser Session ID (for short-term correlation) |
| `client_info` | JSONB | Traffic Data (User Agent, Region, Device Type) |
| `uploaded_at` | TIMESTAMP | |

### `analyses` table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `resume_id` | UUID | Foreign Key -> resumes.id |
| `rms_score` | INTEGER | 0-100 (Marketability Score) |
| `cpi` | VARCHAR | Detected Career Identity (e.g. "Full Stack Dev") |
| `predicted_grad_date` | VARCHAR | AI-extracted graduation date (for cohort analysis) |
| `skills_detected` | JSONB | List of skills found (Analytics) |
| `top_errors` | JSONB | List of critical error types (Analytics) |
| `raw_json` | JSONB | Full structured analysis (PII Redacted) |
| `created_at` | TIMESTAMP | |

---

## 6. Security & Compliance (FERPA)

*   **No PII Storage**: We do not store Names, Emails, or Phone Numbers in the database.
*   **Ephemeral Files**: Raw PDF files are deleted from S3 immediately after analysis (or within 1 hour).
*   **Analytics Only**: The database is used to generate aggregate reports for the department (e.g., "Avg Score: 62").
*   **Encryption**: All data in transit (TLS 1.3) and at rest (Postgres/RDS Encryption).

---

## 7. Performance Considerations

*   **Async Processing**: File upload and analysis can take >10 seconds.
    *   *Phase 1 Architecture*: Synchronous `await` (Simplest). Suitable for <30s.
    *   *Phase 2 Architecture*: Asynchronous Task Queue (Celery/Redis). Backend returns `202 Accepted` + `job_id`. Frontend polls `/api/v1/jobs/{id}`.
    *   *Decision*: We will start with **Synchronous** for MVP. Gemini 1.5 is fast enough. We will switch to Async if timeouts occur.
