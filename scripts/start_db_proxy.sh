#!/bin/bash
# script to start the Google Cloud SQL Auth Proxy for local development

PROJECT_ID="gen-lang-client-0141528519"
REGION="us-central1"
INSTANCE="resume-analyzer-db"

INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${INSTANCE}"

echo "Starting Cloud SQL Proxy for ${INSTANCE_CONNECTION_NAME} on port 5433..."
cloud-sql-proxy ${INSTANCE_CONNECTION_NAME} --port 5433
