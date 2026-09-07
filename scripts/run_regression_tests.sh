#!/usr/bin/env bash
set -e

# Pre-Push Regression Test Suite for BYU Resume Analyzer 2.0
# Prevents auth regressions, missing OAuth keys, or broken frontend/backend builds prior to deployment.

echo "============================================================"
echo "  🔍 Running Pre-Push Regression Test Suite"
echo "============================================================"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# --- Test 1: OAuth Configuration Audit ---
echo "--- [1/4] Auditing OAuth Environment & Deployment Manifests ---"

CLOUDBUILD_FILE="$PROJECT_ROOT/frontend/cloudbuild.yaml"
if ! grep -q "GOOGLE_CLIENT_ID=" "$CLOUDBUILD_FILE"; then
    echo "❌ REGRESSION FAIL: GOOGLE_CLIENT_ID secret mapping is missing from frontend/cloudbuild.yaml!"
    exit 1
fi

if ! grep -q "GOOGLE_CLIENT_SECRET=" "$CLOUDBUILD_FILE"; then
    echo "❌ REGRESSION FAIL: GOOGLE_CLIENT_SECRET secret mapping is missing from frontend/cloudbuild.yaml!"
    exit 1
fi

ENV_LOCAL="$PROJECT_ROOT/frontend/.env.local"
if [ -f "$ENV_LOCAL" ]; then
    if ! grep -q "GOOGLE_CLIENT_ID=" "$ENV_LOCAL" || [ -z "$(grep GOOGLE_CLIENT_ID= "$ENV_LOCAL" | cut -d= -f2)" ]; then
        echo "❌ REGRESSION FAIL: GOOGLE_CLIENT_ID is empty or missing in frontend/.env.local!"
        exit 1
    fi
fi

echo "✅ OAuth Manifest Audit Passed."

# --- Test 2: NextAuth Provider Structure Validation ---
echo "--- [2/4] Validating NextAuth Provider Config ---"

node -e '
const fs = require("fs");
const route = fs.readFileSync("frontend/src/app/api/auth/[...nextauth]/route.ts", "utf8");
if (!route.includes("GoogleProvider")) {
    console.error("❌ NextAuth route is missing GoogleProvider!");
    process.exit(1);
}
if (!route.includes("process.env.GOOGLE_CLIENT_ID")) {
    console.error("❌ NextAuth route is missing process.env.GOOGLE_CLIENT_ID!");
    process.exit(1);
}
console.log("✅ NextAuth GoogleProvider configuration verified.");
'

# --- Test 3: Backend Auth API Integration Tests ---
echo "--- [3/4] Running Backend User Auth Sync Tests ---"
venv/bin/python3 -m pytest backend/tests/api/test_users.py -v

echo "✅ Backend User Auth Sync Tests Passed."

# --- Test 4: Frontend Next.js Build Verification ---
echo "--- [4/4] Verifying Frontend Production Build ---"
cd "$PROJECT_ROOT/frontend"
npm run build
cd "$PROJECT_ROOT"

echo "✅ Frontend Production Build Passed."

echo "============================================================"
echo "🎉 ALL REGRESSION TESTS PASSED CLEANLY! Ready for push."
echo "============================================================"
