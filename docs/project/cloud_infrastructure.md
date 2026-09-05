# Resume Analyzer 2.0 - Cloud Infrastructure 

This document serves as the source of truth for the project's cloud hosting, infrastructure, and deployment architecture.

## 1. Google Cloud Platform (GCP)
All major cloud infrastructure is hosted on Google Cloud Platform. 

- **Primary Project ID**: `gen-lang-client-0141528519`
- **Primary Region**: `us-central1`

### 1.1 Database (Cloud SQL)
We use Cloud SQL (PostgreSQL) for all relational data persistence, replacing the local SQLite implementation used in earlier development phases.

- **Instance Name**: `resume-analyzer-db`
- **Engine Version**: PostgreSQL 15
- **Tier**: Custom (`db-custom-1-3840` / 1 vCPU / 3.75 GB RAM)
- **Primary Databases**:
  - `resume_analyzer_db` (Core application database)

### 1.2 File Storage (Cloud Storage)
Used for persisting student resume PDF uploads permanently across container re-deployments.

### 1.3 Application Hosting (Cloud Run)
The frontend and backend services are containerized via Docker and deployed to Google Cloud Run.

## 2. Environment Variables Mapping
When onboarding or setting up CI/CD pipelines, the following critical environment variables must map to this infrastructure:

- `DATABASE_URL`: The SQLAlchemy connection string pointing to the Cloud SQL PostgreSQL instance. 
  *(Format: `postgresql+psycopg2://user:password@host/dbname`)*
- `GOOGLE_APPLICATION_CREDENTIALS`: A service account JSON key with access to Cloud SQL and Cloud Storage within the `gen-lang-client-0141528519` project.
