# Resume Analyzer 2.0 - GCP Cloud Run Deployment

This folder contains deployment guides for deploying Resume Analyzer 2.0 to **Google Cloud Platform** using **Cloud Run**.

## 🚀 Deployment Strategy

- **Platform:** Google Cloud Run (serverless containers)
- **Backend:** FastAPI on Cloud Run
- **Frontend:** Next.js on Cloud Run
- **Database:** Cloud SQL PostgreSQL (or SQLite for testing)
- **Storage:** Google Cloud Storage
- **CI/CD:** Cloud Build with GitHub integration

## 📚 Documentation

### Quick Start
1. **[deployment_guide.md](deployment_guide.md)** - Complete deployment walkthrough (start here)
2. **[deployment_commands.md](deployment_commands.md)** - Quick reference commands
3. **[cloud_sql_setup.md](cloud_sql_setup.md)** - Production database setup

### Deployment Order
1. Enable GCP APIs and set up billing
2. (Optional) Set up Cloud SQL database for production
3. Deploy backend to Cloud Run
4. Deploy frontend to Cloud Run
5. Configure IAM permissions
6. Set up CI/CD with Cloud Build

## 📁 Archive

The `archive/` folder contains documentation from previous deployment strategies (Vercel/Render) that are no longer in use.

## 💡 Notes

- **Cost Optimization:** Cloud Run scales to zero when not in use
- **Testing:** Start with SQLite (no database setup needed)
- **Production:** Migrate to Cloud SQL PostgreSQL
- **Custom Domains:** Can be added later via Global Load Balancer (not included in initial setup)
