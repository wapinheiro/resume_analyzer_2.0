# Resume Analyzer 2.0 - Deployment Complete ✅

## Deployment Summary

Successfully deployed Resume Analyzer 2.0 to **Google Cloud Run** in the correct project.

**Deployment Date:** 2026-02-16  
**GCP Project:** `gen-lang-client-0141528519` (resume-analyzer-2)  
**Project Number:** `87294979859`  
**Region:** `us-central1`

---

## 🚀 Deployed Services

### Backend Service
- **URL:** https://resume-analyzer-backend-87294979859.us-central1.run.app
- **Status:** ✅ Healthy
- **Memory:** 1Gi
- **Database:** SQLite (in-container, for testing)
- **Health Check:** `curl https://resume-analyzer-backend-87294979859.us-central1.run.app/health`

### Frontend Service
- **URL:** https://resume-analyzer-frontend-87294979859.us-central1.run.app
- **Status:** ✅ Deployed
- **Memory:** 512Mi
- **Framework:** Next.js

---

## 📍 Where to Find Services in GCP Console

**Direct Link:** https://console.cloud.google.com/run/services?project=gen-lang-client-0141528519

**Navigation:**
1. Go to Google Cloud Console
2. Select project: **resume-analyzer-2** (gen-lang-client-0141528519)
3. Navigate to: **Cloud Run** → **Services**
4. You should see both services listed

---

## 🔧 Configuration

### Backend Environment Variables
- `GOOGLE_API_KEY`: AIzaSyAjqRLAzheNHFPzqzbQTdd48CQE4icxAUY
- `GCS_BUCKET_NAME`: byu-resumes-bucket

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: https://resume-analyzer-backend-87294979859.us-central1.run.app
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: pk_test_aGVscGVkLWRvYmVybWFuLTU0LmNsZXJrLmFjY291bnRzLmRldiQ
- `CLERK_SECRET_KEY`: sk_test_Sf66M8hjjE3IZrXCyNIeGGCrwF3KVprIcvC9lyH1YL

### IAM Permissions Configured
- ✅ Cloud Build service account permissions (run.admin, iam.serviceAccountUser)
- ✅ Compute service account storage permissions (storage.admin)
- ✅ GCS bucket access for resume storage

---

## 🛠️ Troubleshooting Steps Taken

### Issue 1: Wrong Project
**Problem:** Initially deployed to `resumeanalyzer-465907` instead of `resume-analyzer-2`  
**Solution:** Switched to correct project `gen-lang-client-0141528519` and redeployed

### Issue 2: IAM Permissions
**Problem:** Cloud Build failed with permission denied errors  
**Solution:** Granted required IAM roles:
```bash
# Cloud Build service account
gcloud projects add-iam-policy-binding gen-lang-client-0141528519 \
  --member="serviceAccount:87294979859@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding gen-lang-client-0141528519 \
  --member="serviceAccount:87294979859@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Compute service account
gcloud projects add-iam-policy-binding gen-lang-client-0141528519 \
  --member="serviceAccount:87294979859-compute@developer.gserviceaccount.com" \
  --role="roles/storage.admin"
```

---

## ⚠️ Current Limitations (SQLite Deployment)

- **Ephemeral Storage:** Data is lost when container restarts
- **Not Production-Ready:** SQLite is in-memory/container-local
- **No Persistence:** Database resets on each deployment

---

## 🎯 Next Steps: Production Deployment (Cloud SQL)

To make this production-ready, migrate to Cloud SQL PostgreSQL:

### 1. Create Cloud SQL Instance
```bash
gcloud sql instances create resume-analyzer-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

### 2. Create Database
```bash
gcloud sql databases create resume_analyzer \
  --instance=resume-analyzer-db
```

### 3. Set Password
```bash
gcloud sql users set-password postgres \
  --instance=resume-analyzer-db \
  --password="YOUR_SECURE_PASSWORD"
```

### 4. Store Connection String in Secret Manager
```bash
# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe resume-analyzer-db --format='value(connectionName)')

# Create secret
echo -n "postgresql://postgres:YOUR_PASSWORD@/resume_analyzer?host=/cloudsql/${CONNECTION_NAME}" | \
  gcloud secrets create database-url --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:87294979859-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 5. Redeploy Backend with Cloud SQL
```bash
cd backend
gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --add-cloudsql-instances="${CONNECTION_NAME}" \
  --set-secrets="DATABASE_URL=database-url:latest" \
  --set-env-vars="GOOGLE_API_KEY=AIzaSyAjqRLAzheNHFPzqzbQTdd48CQE4icxAUY,GCS_BUCKET_NAME=byu-resumes-bucket"
```

---

## 💡 Critical Fix: Next.js Build-Time Variables

During testing, we discovered that Next.js requires environment variables like `NEXT_PUBLIC_API_URL` to be available at **build time** so they can be baked into the client-side JavaScript.

**Troubleshooting Actions:**
1. **Dockerfile Update:** Added `ARG` and `ENV` steps to accept variables during the build process.
2. **Cloud Build Update:** Modified `cloudbuild.yaml` to pass build arguments using `--build-arg`.
3. **Manual Trigger:** Re-ran the build with `gcloud builds submit` passing the correct API and Clerk credentials.

**This ensures the frontend correctly connects to the backend URL instead of defaulting to `localhost:8000`.**

---

## 🧪 Testing the Deployment

### Test Backend
```bash
curl https://resume-analyzer-backend-87294979859.us-central1.run.app/health
```

### Test Frontend
Open in browser: https://resume-analyzer-frontend-87294979859.us-central1.run.app

### View Logs
```bash
# Backend logs
gcloud run services logs read resume-analyzer-backend --region=us-central1 --limit=20

# Frontend logs
gcloud run services logs read resume-analyzer-frontend --region=us-central1 --limit=20
```

---

## 💰 Cost Estimate

**Current Setup (SQLite):**
- Cloud Run Backend: ~$0-5/month (scales to zero)
- Cloud Run Frontend: ~$0-3/month (scales to zero)
- Cloud Storage: ~$0.02/GB/month
- **Total:** ~$0-10/month

**After Cloud SQL Migration:**
- Add ~$10-15/month for db-f1-micro instance
- **New Total:** ~$10-25/month

---

## 📚 Documentation

- [deployment_guide.md](file:///Users/wagnerp2/Documents/byu/resume_analyzer_2.0/docs/deployment/deployment_guide.md)
- [cloud_sql_setup.md](file:///Users/wagnerp2/Documents/byu/resume_analyzer_2.0/docs/deployment/cloud_sql_setup.md)
- [deployment_commands.md](file:///Users/wagnerp2/Documents/byu/resume_analyzer_2.0/docs/deployment/deployment_commands.md)
