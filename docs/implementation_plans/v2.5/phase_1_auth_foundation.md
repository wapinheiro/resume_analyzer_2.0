# Technical Specification: Phase 1 (Auth Foundation)

## Objective
Establish persistent user accounts and authentication using NextAuth.js (Auth.js) with Google and GitHub OAuth providers. Link analyzed resumes to specific users in the PostgreSQL database.

## 1. Database Schema Changes (Backend)

### 1.1 New `users` Table
Create an Alembic migration to add a `users` table.
*   `id`: UUID (Primary Key)
*   `email`: String (Unique, Indexed)
*   `name`: String (Nullable)
*   `avatar_url`: String (Nullable)
*   `role`: String (Default: 'student', Enum: 'student', 'advisor', 'admin')
*   `created_at`: DateTime
*   `last_login`: DateTime

### 1.2 Update `resumes` Table
Modify the existing `resumes` table.
*   Add `user_id`: UUID (Foreign Key linking to `users.id`, Nullable for backwards compatibility during migration).
*   Create an index on `user_id` for fast lookups.

### 1.3 Alembic Migration
Run `alembic revision --autogenerate -m "add users and link resumes"` and verify the generated script.

## 2. FastApi Backend Updates

### 2.1 JWT Verification
*   Implement a new dependency `get_current_user(token: str = Depends(oauth2_scheme))` in `app/api/deps.py`.
*   This function must decode the NextAuth JWT. Note: NextAuth uses JWE (JSON Web Encryption) or custom secret hashing by default. We must configure NextAuth to issue a standard JWT that FastAPI can verify using a shared `NEXTAUTH_SECRET`.

### 2.2 Endpoint Updates
*   **POST /resumes/analyze:** Update to accept an optional Authorization header. If present and valid, attach the `user_id` to the newly created `Resume` and `Analysis` records.

## 3. Next.js Frontend Updates

### 3.1 Install NextAuth
*   `npm install next-auth`

### 3.2 Configure `[...nextauth].ts` (or Route Handler)
*   Set up GoogleProvider and GitHubProvider.
*   **Database Adapter:** Instead of using Prisma/Drizzle (to keep backend logic solely in FastAPI), we will use NextAuth's `jwt` callback.
*   **Sign-in Callback:** When a user logs in via OAuth, the frontend must make a server-to-server POST request to the FastAPI backend (e.g., `/api/auth/sync-user`) passing the email/name to ensure the user exists in the PostgreSQL `users` table and to retrieve the internal `user_id` and `role`.
*   **JWT Callback:** Embed the Postgres `user_id` and `role` into the NextAuth JWT so it can be passed to the backend on subsequent requests.

### 3.3 UI Components
*   Create a `<LoginButton />` component in the navbar.
*   Wrap the application or specific pages in `<SessionProvider>`.
