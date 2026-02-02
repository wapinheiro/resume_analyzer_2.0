# Implementation Plan - CI/CD & Project Skeleton

## Goal
Establish an automated CI/CD pipeline immediately to ensure an "always working" codebase. This helps catch issues early and maintains code quality from the start.

## Deployment Strategy (AWS Free Tier)
> [!IMPORTANT]
> **Target**: AWS Free Tier
> - **Frontend**: **AWS Amplify**. It natively supports Next.js, provides continuous deployment out of the box, and has a generous free tier.
> - **Backend**: **AWS Lambda** (via Docker container). This allows us to run standard Docker containers serverlessly. It's cost-effective (pay-per-request) and fits the free tier limits (400,000 GB-seconds).
> - **Database**: **AWS RDS** (PostgreSQL) - Free tier offers 750 hours/month (enough for 24/7 one instance).

> [!NOTE]
> For the initial "Always working" setup, we will configure the **CI (Continuous Integration)** part to build and test code.
> **CD (Continuous Deployment)** requires AWS Credentials. We will add the *configuration files* (Dockerfiles, etc.) now, so deployment is ready to be turned on once credentials are added.

## Proposed Changes

### 1. Project Skeleton Setup
Since the repository is currently empty (except for docs), we will initialize the basic structure:

#### [NEW] Directory Structure
```text
resume_analyzer_2.0/
├── backend/            # Python/FastAPI
│   ├── app/
│   ├── tests/
│   ├── pyproject.toml  # Dependency management
│   └── .gitignore
├── frontend/           # Next.js or React
│   ├── src/
│   ├── package.json
│   └── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml      # CI Configuration
└── .gitignore          # Root gitignore
```

### 2. CI/CD Pipeline (`.github/workflows/ci.yml`)
We will create a GitHub Actions workflow that runs on every push and pull request.

#### Jobs

**A. Backend (FastAPI)**
- **Lint & Test**: Run `pytest` and linter to ensure code quality.
- **Build**: Build the Docker image to ensure it works.
- *(Future)* **Deploy**: Push to AWS ECR and update Lambda/App Runner (requires AWS keys).

**B. Frontend (Next.js)**
- **Lint & Test**: Run `npm test` and `eslint`.
- **Build Check**: Run `npm run build` to verify the production build succeeds.
- *(Future)* **Deploy**: AWS Amplify usually connects directly to GitHub, so the CD for frontend is handled by connecting the repo to Amplify Console, rather than a script in `ci.yml`.

### 3. Deployment Configuration Files [NEW]
We will add the necessary files to make the app "deployable" from day one.

#### Backend
- `backend/Dockerfile`: A production-ready Dockerfile for FastAPI.
- `backend/requirements.txt`: Python dependencies.

#### Frontend
- `frontend/Dockerfile`: (Optional for Amplify, but good for local reliability) or just `frontend/package.json`.

## Verification Plan

### Automated Verification
- We will push the new `.github/workflows/ci.yml` and the skeleton code.
- We will navigate to the GitHub 'Actions' tab to confirm the workflow runs successfully.
- We will verify that both 'Backend Check' and 'Frontend Check' jobs pass.
