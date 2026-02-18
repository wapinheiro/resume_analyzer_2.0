# Resume Analyzer 2.0 - Cloud Run Deployment Guide

## Overview

This guide walks through deploying Resume Analyzer 2.0 to Google Cloud Run with Cloud SQL PostgreSQL.

**Architecture:**
- **Backend:** FastAPI on Cloud Run (1Gi memory)
- **Frontend:** Next.js on Cloud Run (512Mi memory)
- **Database:** Cloud SQL PostgreSQL 15
- **Storage:** Google Cloud Storage (existing bucket: `byu-resumes-bucket`)
- **AI:** Google Gemini API
- **Auth:** Clerk

---

## Prerequisites

### Required
- Google Cloud Platform account with billing enabled
- `gcloud` CLI installed and authenticated
- Docker installed (for local testing)
- Git repository for CI/CD

### GCP APIs to Enable
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

---

## Deployment Steps

### 1. Database Setup (Optional for Testing)

For initial testing, you can use SQLite (already configured). For production, set up Cloud SQL:

See **[cloud_sql_setup.md](cloud_sql_setup.md)** for complete Cloud SQL instructions.

**Quick version:**
```bash
# Create instance
gcloud sql instances create resume-analyzer-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create resume_analyzer \
  --instance=resume-analyzer-db

# Store connection string in Secret Manager
echo -n "postgresql://postgres:PASSWORD@/resume_analyzer?host=/cloudsql/PROJECT:REGION:INSTANCE" | \
  gcloud secrets create database-url --data-file=-
```

### 2. Deploy Backend

```bash
cd backend

# Deploy with SQLite (testing)
gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --set-env-vars="GOOGLE_API_KEY=YOUR_KEY,GCS_BUCKET_NAME=byu-resumes-bucket"

# OR Deploy with Cloud SQL (production)
gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --add-cloudsql-instances="PROJECT:REGION:INSTANCE" \
  --set-secrets="DATABASE_URL=database-url:latest" \
  --set-env-vars="GOOGLE_API_KEY=YOUR_KEY,GCS_BUCKET_NAME=byu-resumes-bucket"
```

### 3. Get Backend URL

```bash
BACKEND_URL=$(gcloud run services describe resume-analyzer-backend \
  --region=us-central1 \
  --format='value(status.url)')

echo "Backend URL: $BACKEND_URL"
```

### 4. Deploy Frontend

```bash
cd ../frontend

gcloud run deploy resume-analyzer-frontend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_KEY,CLERK_SECRET_KEY=YOUR_SECRET"
```

### 5. Set Up IAM Permissions

```bash
# Get service account
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format="value(projectNumber)")
SA_EMAIL="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

# Grant GCS access
gsutil iam ch serviceAccount:${SA_EMAIL}:roles/storage.objectAdmin gs://byu-resumes-bucket

# Grant Secret Manager access (if using Cloud SQL)
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"
```

---

## CI/CD Setup

### 1. Connect GitHub Repository

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Connect Repository"
3. Authenticate with GitHub
4. Select your repository

### 2. Create Build Triggers

**Backend Trigger:**
```bash
gcloud builds triggers create github \
  --name=resume-analyzer-backend-deploy \
  --repo-name=resume_analyzer_2.0 \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=backend/cloudbuild.yaml
```

**Frontend Trigger:**
```bash
gcloud builds triggers create github \
  --name=resume-analyzer-frontend-deploy \
  --repo-name=resume_analyzer_2.0 \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=frontend/cloudbuild.yaml
```

### 3. Grant Cloud Build Permissions

```bash
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format="value(projectNumber)")
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/iam.serviceAccountUser"
```

---

## Testing

### Backend Health Check
```bash
curl $BACKEND_URL/health
```

### View Logs
```bash
# Backend logs
gcloud run services logs read resume-analyzer-backend --region=us-central1 --limit=50

# Frontend logs
gcloud run services logs read resume-analyzer-frontend --region=us-central1 --limit=50
```

---

## Environment Variables Reference

### Backend
- `GOOGLE_API_KEY` - Gemini AI API key
- `GCS_BUCKET_NAME` - Cloud Storage bucket (byu-resumes-bucket)
- `DATABASE_URL` - Database connection string (from Secret Manager or direct)
- `BACKEND_CORS_ORIGINS` - Allowed origins (auto-configured)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend Cloud Run URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

---

## Troubleshooting

### Build Fails
- Check `cloudbuild.yaml` syntax
- Verify all dependencies in `requirements.txt` / `package.json`
- Check Cloud Build logs in console

### Database Connection Issues
- Verify Cloud SQL instance is running
- Check connection string format
- Ensure `--add-cloudsql-instances` flag is set
- Verify service account has Cloud SQL Client role

### CORS Errors
- Update `BACKEND_CORS_ORIGINS` to include frontend URL
- Redeploy backend after updating

---

## Cost Estimates

- **Cloud Run Backend:** ~$0-5/month (scales to zero)
- **Cloud Run Frontend:** ~$0-3/month (scales to zero)
- **Cloud SQL (db-f1-micro):** ~$10-15/month
- **Cloud Storage:** ~$0.02/GB/month
- **Total:** ~$10-25/month depending on usage

---

## Next Steps

1. ✅ Deploy backend and frontend
2. ✅ Set up CI/CD triggers
3. ⏭️ Monitor costs and set billing alerts
4. ⏭️ Set up custom domain (Phase 2)
5. ⏭️ Configure monitoring and alerting
