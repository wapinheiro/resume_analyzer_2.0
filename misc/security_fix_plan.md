# Implementation Plan - Fix CORS Configuration

The frontend is unable to communicate with the backend due to CORS policy restrictions. We need to update the backend to allow requests from the deployed frontend origin.

## Proposed Changes

### Backend Deployment

We will redeploy the backend with the `BACKEND_CORS_ORIGINS` environment variable set to include the frontend URL.

#### [MODIFY] [resume-analyzer-backend deployment](https://console.cloud.google.com/run/detail/us-central1/resume-analyzer-backend)

Redeploy the backend service with the following environment variables:
- `BACKEND_CORS_ORIGINS=["https://resume-analyzer-frontend-87294979859.us-central1.run.app"]`

## Verification Plan

### Manual Verification
1.  **Frontend Test:**
    - Open the frontend: https://resume-analyzer-frontend-87294979859.us-central1.run.app
    - Upload a resume and click "Analyze My Resume".
    - Verify in the browser console that the CORS error is gone and the analysis request succeeds.

# Security Fix & Production Readiness

The `GOOGLE_API_KEY` was reported as leaked and blocked. We must move all sensitive credentials to Google Secret Manager and update the CI/CD pipeline to use them securely.

## User Action Required

> [!IMPORTANT]
> 1. **Revoke the leaked key**: Go to the Google Cloud Console and delete the leaked API key.
> 2. **Generate a new key**: Create a new API key for the Gemini API.
> 3. **Provide the new key**: You will need to provide the new key for us to store it in Secret Manager.

## Proposed Changes

### [Secret Manager Setup]

We will store the following sensitive variables in Secret Manager:
- `GOOGLE_API_KEY`
- `CLERK_SECRET_KEY`

### [Backend]

#### [MODIFY] [cloudbuild.yaml](file:///Users/wagnerp2/Documents/byu/resume_analyzer_2.0/backend/cloudbuild.yaml)
- Remove hardcoded environment variables.
- Update the deploy step to pull `GOOGLE_API_KEY` from Secret Manager.

### [Frontend]

#### [MODIFY] [cloudbuild.yaml](file:///Users/wagnerp2/Documents/byu/resume_analyzer_2.0/frontend/cloudbuild.yaml)
- Update the build step to pull `CLERK_SECRET_KEY` from Secret Manager.

---

## Verification Plan

### Automated Tests
- Run `git push` and verify that Cloud Build correctly pulls the secrets and deploys successfully.

### Manual Verification
- Test the "Analyze My Resume" feature in the live app to confirm the new API key works.
    - Verify in the browser console that the CORS error is gone and the analysis request succeeds.
