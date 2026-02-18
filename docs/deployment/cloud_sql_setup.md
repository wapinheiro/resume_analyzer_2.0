# Cloud SQL PostgreSQL Setup for Resume Analyzer 2.0

## Overview

This guide sets up a managed PostgreSQL database for production use with Cloud Run.

**Estimated Cost:** ~$10-15/month for db-f1-micro tier (smallest instance)

---

## Step 1: Create Cloud SQL Instance

```bash
# Set variables
PROJECT_ID="your-project-id"
REGION="us-central1"
INSTANCE_NAME="resume-analyzer-db"

# Create PostgreSQL instance
gcloud sql instances create ${INSTANCE_NAME} \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=${REGION} \
  --storage-type=HDD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04
```

**This will take 5-10 minutes to complete.**

---

## Step 2: Set Database Password

```bash
# Set root password
gcloud sql users set-password postgres \
  --instance=${INSTANCE_NAME} \
  --password="YOUR_SECURE_PASSWORD"
```

> [!WARNING]
> Store this password securely! You'll need it for the connection string.

---

## Step 3: Create Database

```bash
# Create the application database
gcloud sql databases create resume_analyzer \
  --instance=${INSTANCE_NAME}
```

---

## Step 4: Get Connection Name

```bash
# Get the connection name (format: PROJECT_ID:REGION:INSTANCE_NAME)
gcloud sql instances describe ${INSTANCE_NAME} \
  --format='value(connectionName)'
```

**Save this connection name** - you'll need it for Cloud Run configuration.

---

## Step 5: Configure Cloud Run Backend

### Update Deployment Command

Add these flags to your backend deployment:

```bash
gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --add-cloudsql-instances="PROJECT_ID:REGION:INSTANCE_NAME" \
  --set-env-vars="DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@/resume_analyzer?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME" \
  --set-env-vars="GOOGLE_API_KEY=YOUR_KEY,GCS_BUCKET_NAME=byu-resumes-bucket"
```

### Connection String Format

```
postgresql://USERNAME:PASSWORD@/DATABASE_NAME?host=/cloudsql/CONNECTION_NAME
```

**Example:**
```
postgresql://postgres:mySecurePass123@/resume_analyzer?host=/cloudsql/my-project:us-central1:resume-analyzer-db
```

---

## Step 6: Update cloudbuild.yaml

Add Cloud SQL connection to the backend `cloudbuild.yaml`:

```yaml
# In the deploy step, add these args:
- '--add-cloudsql-instances=PROJECT_ID:REGION:INSTANCE_NAME'
- '--update-env-vars=DATABASE_URL=postgresql://postgres:PASSWORD@/resume_analyzer?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME'
```

> [!IMPORTANT]
> **Security Best Practice:** Don't hardcode the password in `cloudbuild.yaml`. Use Secret Manager instead (see Step 7).

---

## Step 7: Use Secret Manager (Recommended)

### Create Secret for Database URL

```bash
# Create secret
echo -n "postgresql://postgres:YOUR_PASSWORD@/resume_analyzer?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME" | \
  gcloud secrets create database-url --data-file=-

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Update Cloud Run to Use Secret

```bash
gcloud run deploy resume-analyzer-backend \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --add-cloudsql-instances="PROJECT_ID:REGION:INSTANCE_NAME" \
  --set-secrets="DATABASE_URL=database-url:latest"
```

---

## Step 8: Run Database Migrations

Once deployed, migrations will run automatically via the Dockerfile:

```dockerfile
CMD sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
```

The `alembic upgrade head` command creates all necessary tables.

---

## Step 9: Verify Connection

```bash
# Get backend URL
BACKEND_URL=$(gcloud run services describe resume-analyzer-backend \
  --region=us-central1 \
  --format='value(status.url)')

# Test health endpoint
curl ${BACKEND_URL}/health

# Check logs for database connection
gcloud run services logs read resume-analyzer-backend \
  --region=us-central1 \
  --limit=50
```

---

## Migration from SQLite

If you have existing data in SQLite:

1. **Export SQLite data:**
   ```bash
   # Use a migration tool or manual export
   sqlite3 sql_app.db .dump > backup.sql
   ```

2. **Import to PostgreSQL:**
   ```bash
   # Connect to Cloud SQL
   gcloud sql connect resume-analyzer-db --user=postgres
   
   # Import data (may need manual adjustments)
   \i backup.sql
   ```

3. **Verify data:**
   ```sql
   \dt  -- List tables
   SELECT COUNT(*) FROM your_table;
   ```

---

## Cost Optimization

### Development/Testing
- Use `db-f1-micro` tier (~$10/month)
- Enable auto-increase storage
- Schedule backups during off-hours

### Production Scaling
- Upgrade to `db-g1-small` or higher as needed
- Enable High Availability (adds cost but improves reliability)
- Monitor query performance

### Cost Monitoring
```bash
# Check current costs
gcloud billing accounts list
gcloud billing projects describe PROJECT_ID
```

---

## Troubleshooting

### Connection Errors

**Error:** "Could not connect to Cloud SQL instance"
- Verify `--add-cloudsql-instances` flag is set
- Check connection name format
- Ensure Cloud Run service account has Cloud SQL Client role

**Error:** "Authentication failed"
- Verify password in connection string
- Check username (default is `postgres`)

### Performance Issues

- Check Cloud SQL instance metrics in Console
- Review slow query logs
- Consider upgrading instance tier

---

## Security Checklist

- [ ] Use Secret Manager for DATABASE_URL
- [ ] Don't commit passwords to git
- [ ] Enable automated backups
- [ ] Restrict database access to Cloud Run service account only
- [ ] Use SSL connections (enabled by default with Unix socket)
- [ ] Regularly rotate database passwords
- [ ] Monitor access logs

---

## Next Steps

1. Review this setup plan
2. Decide on instance tier (db-f1-micro recommended for start)
3. Choose password management strategy (Secret Manager recommended)
4. Execute setup commands
5. Update deployment configurations
6. Test connection and migrations
