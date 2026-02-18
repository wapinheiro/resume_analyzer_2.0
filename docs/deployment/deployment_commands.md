# Resume Analyzer 2.0 - Quick Deployment Commands

## Prerequisites Check

```bash
# Verify gcloud is installed and authenticated
gcloud auth list
gcloud config get-value project

# Enable required APIs
gcloud services enable run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  sql-component.googleapis.com \
  secretmanager.googleapis.com
```

---

## Option 1: Quick Deploy (SQLite - Testing Only)

### Backend
```bash
cd /Users/wagnerp2/Documents/byu/resume_analyzer_2.0/backend

gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --set-env-vars="GOOGLE_API_KEY=YOUR_GEMINI_KEY,GCS_BUCKET_NAME=byu-resumes-bucket"
```

### Frontend
```bash
cd /Users/wagnerp2/Documents/byu/resume_analyzer_2.0/frontend

# Get backend URL first
BACKEND_URL=$(gcloud run services describe resume-analyzer-backend --region=us-central1 --format='value(status.url)')

gcloud run deploy resume-analyzer-frontend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --set-env-vars="NEXT_PUBLIC_API_URL=${BACKEND_URL},NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_KEY,CLERK_SECRET_KEY=YOUR_CLERK_SECRET"
```

---

## Option 2: Production Deploy (Cloud SQL)

### 1. Set up Cloud SQL
```bash
# Create instance (takes 5-10 minutes)
gcloud sql instances create resume-analyzer-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create resume_analyzer --instance=resume-analyzer-db

# Set password
gcloud sql users set-password postgres \
  --instance=resume-analyzer-db \
  --password="YOUR_SECURE_PASSWORD"

# Get connection name
gcloud sql instances describe resume-analyzer-db --format='value(connectionName)'
# Save this! Format: PROJECT_ID:REGION:INSTANCE_NAME
```

### 2. Store DATABASE_URL in Secret Manager
```bash
# Replace with your actual values
echo -n "postgresql://postgres:YOUR_PASSWORD@/resume_analyzer?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME" | \
  gcloud secrets create database-url --data-file=-

# Grant access
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Deploy Backend with Cloud SQL
```bash
cd /Users/wagnerp2/Documents/byu/resume_analyzer_2.0/backend

# Get connection name from step 1
CONNECTION_NAME="PROJECT_ID:REGION:INSTANCE_NAME"

gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --add-cloudsql-instances="${CONNECTION_NAME}" \
  --set-secrets="DATABASE_URL=database-url:latest" \
  --set-env-vars="GOOGLE_API_KEY=YOUR_KEY,GCS_BUCKET_NAME=byu-resumes-bucket"
```

### 4. Deploy Frontend (same as Option 1)

---

## Grant GCS Permissions

```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
SA_EMAIL="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gsutil iam ch serviceAccount:${SA_EMAIL}:roles/storage.objectAdmin gs://byu-resumes-bucket
```

---

## Get Service URLs

```bash
# Backend
gcloud run services describe resume-analyzer-backend --region=us-central1 --format='value(status.url)'

# Frontend
gcloud run services describe resume-analyzer-frontend --region=us-central1 --format='value(status.url)'
```

---

## Test Deployment

```bash
# Test backend health
BACKEND_URL=$(gcloud run services describe resume-analyzer-backend --region=us-central1 --format='value(status.url)')
curl ${BACKEND_URL}/health

# View logs
gcloud run services logs read resume-analyzer-backend --region=us-central1 --limit=20
```

---

## Environment Variables Reference

### Backend
- `GOOGLE_API_KEY` - Your Gemini AI API key
- `GCS_BUCKET_NAME` - `byu-resumes-bucket`
- `DATABASE_URL` - (from Secret Manager for Cloud SQL, or auto-configured for SQLite)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend Cloud Run URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk public key
- `CLERK_SECRET_KEY` - Your Clerk secret key
