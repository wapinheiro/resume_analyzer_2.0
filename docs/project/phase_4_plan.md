# Phase 4 Implementation Plan: Production Hardening & Features

## 1. Data Integrity: Database Migrations (Alembic)
**Objective**: Move away from `Base.metadata.create_all()` to a robust migration system using Alembic.
**Why**: Production databases cannot be dropped/recreated. Schema changes must be versioned.

**Steps**:
1.  Install `alembic`.
2.  Initialize alembic in `backend/` (`alembic init alembic`).
3.  Configure `alembic.ini` and `env.py` to load the SQLAlchemy URL and `Base` metadata.
4.  Generate "Initial Migration" (`alembic revision --autogenerate`).
5.  Update `backend/app/main.py` to stop using `create_all()`.
6.  Update `Dockerfile` and `render.yaml` to run migrations on deploy.

## 2. File Storage: GCP Cloud Storage Integration
**Objective**: Replace the ephemeral "Stub S3" implementation with real cloud storage.
**Why**: Render/Vercel filesystems are ephemeral. We lose uploaded PDFs on every deploy/restart.
**Free Tier Strategy**: Use GCP Cloud Storage "Always Free" tier (5GB Regional Storage in us-east1/us-west1/us-central1).

**Steps**:
1.  Create GCP Project & Enable Cloud Storage API.
2.  Create a Bucket (Standard Class, Regional - e.g., `us-central1` for free tier eligible).
3.  Create Service Account with `Storage Object Admin` role.
4.  Download Service Account JSON key.
5.  Update `backend/requirements.txt` with `google-cloud-storage`.
6.  Create `backend/app/services/gcs.py`:
    -   Implement `upload_file(file_obj, bucket, filename)`.
    -   Implement `generate_signed_url(bucket, filename)` (for viewing).
7.  Update `.env` with `GOOGLE_APPLICATION_CREDENTIALS` (path or JSON content) and `GCS_BUCKET_NAME`.
8.  Refactor `analyze.py` to use the new GCS service.

## 3. Authentication: User Accounts
**Objective**: Allow users to save their history effectively.
**Stack**: Clerk (Frontend + Backend validation) or NextAuth (with custom backend provider).
**Decision**: **Clerk** is recommended for speed and ease of integration with Next.js + Python.

**Steps**:
1.  **Frontend**:
    -   Install `@clerk/nextjs`.
    -   Wrap app in `<ClerkProvider>`.
    -   Add `<SignIn>` / `<SignUp>` pages.
2.  **Backend**:
    -   Verify JWT tokens from Clerk in FastAPI `dependencies.py`.
    -   Extract `user_id` from token.
3.  **Database**:
    -   Add `user_id` (String/Index) to `resumes` and `analyses` tables.
    -   Migrate existing data (nullable) -> new data (required).

## 4. Feature: Resume Comparison
**Objective**: Side-by-side view of two versions of a resume.

**Steps**:
1.  **Frontend**:
    -   New page `/compare`.
    -   Select 2 analyses from History.
    -   Visual Diff UI (Score delta, Key changes).
2.  **Backend**:
    -   Endpoint `/analyses/compare?id1=...&id2=...`.

## 5. Feature: PDF Optimization Engine (Stretch)
**Objective**: Generate a physical PDF file with the suggested improvements.
**Tools**: `reportlab` or HTML-to-PDF (`weasyprint`).

**Steps**:
1.  Define a standard "ATS-Friendly" HTML template.
2.  Inject "Optimized Content" (re-written bullets) into template.
3.  Convert HTML -> PDF.
4.  Return PDF stream.
