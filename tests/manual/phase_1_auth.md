# Manual Testing Script - Phase 1: Auth Foundation

This document outlines the steps to verify that the core authentication and database syncing systems built in Phase 1 are functioning correctly.

## Prerequisites
1. Open the project root.
2. Ensure you have the `.env` installed and configured with your Gemini, Google OAuth, GitHub OAuth, and DB settings.
3. Start the FastAPI backend:
   ```bash
   cd backend
   ../venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. Start the Next.js frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Test Cases

### 1. User Authentication & Database Sync
**Goal:** Ensure logging in through NextAuth successfully syncs the user to the Postgres database.
1. Open your browser and navigate to `http://localhost:3000`.
2. Click the **"Log In"** button in the navigation bar.
3. Choose either **Google** or **GitHub** to sign in.
4. **Expected:** You are redirected to the `/dashboard` route automatically upon successful authentication.
5. In a new terminal, check the SQLite database to verify your user record was created:
   ```bash
   cd backend
   sqlite3 sql_app.db
   sqlite> SELECT id, email, role FROM users;
   ```
6. **Expected:** You should see your email address listed with the role `student`.

### 2. Resume Attribution (user_id mapping)
**Goal:** Ensure new resume uploads are correctly tagged with the authenticated user's Postgres ID.
1. While logged in at `http://localhost:3000`, go to the homepage or dashboard.
2. Upload a simple sample resume PDF.
3. Wait for the analysis to complete.
4. Query the database to check the uploaded resume:
   ```bash
   cd backend
   sqlite3 sql_app.db
   sqlite> SELECT id, user_id FROM resumes ORDER BY uploaded_at DESC LIMIT 1;
   ```
5. **Expected:** The `user_id` should exactly match the UUID found for your user in the `users` table from Test 1.

### 3. Protected Routes
**Goal:** Ensure unauthenticated users cannot access restricted student routes.
1. Click the **"Sign out"** button in the navigation bar.
2. Attempt to navigate directly to `http://localhost:3000/dashboard` by typing it into the URL bar.
3. **Expected:** You should be immediately redirected to the homepage `http://localhost:3000/`. Next.js `middleware.ts` should prevent access without a valid JWT.
