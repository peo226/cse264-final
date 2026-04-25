# Authentication

This app uses **Supabase Auth** for user management and **JWT tokens** for API requests.

## Setup

### 1. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Google OAuth (optional)

1. In Supabase dashboard, go to **Authentication → Providers → Google**
2. Toggle it **ON**
3. Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create a Web application OAuth client
4. Add authorized redirect URI: `https://your-supabase-url/auth/v1/callback`
5. Paste Client ID and Secret into Supabase Google provider form

### 3. Environment variables

**`client/.env`:**

VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

**remember not to commit .env!!**

---

## How it works

1. **User registers/logs in** via email/password or Google OAuth in the frontend
2. **Supabase issues a JWT token** containing the user's ID and session info
3. **Token is stored** in browser localStorage
4. **Token is attached to requests** via `Authorization: Bearer <token>` header
5. **Backend verifies the JWT** to identify the user on protected routes
6. **Token persists** across page refreshes via `AuthContext`

---

## Files

- `client/src/lib/supabase.js` — Supabase client initialization
- `client/src/context/AuthContext.jsx` — Session state, login/logout/register
- `client/src/components/auth/` — Login form, register form, Google OAuth button
- `client/src/components/layout/ProtectedRoute.jsx` — Route protection middleware

---

## User creation in database

When a user registers via Supabase Auth:
1. Supabase creates a row in its private `auth.users` table (ground truth for authentication)
2. **A trigger should auto-create a row in a public `users` table** in AWS RDS PostgreSQL **(WIP)**
   - Columns: `id` (UUID), `email`, `created_at`, etc.
   - This allows the REST API to query user data



---

## Architecture
AI disclaimer: weused claude to generate this diagram based on our file structure
```
┌────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    AuthContext                           │  │
│  │  - Stores current user session                           │  │
│  │  - Functions: login(), register(), loginWithGoogle()     │  │
│  │  - Persists JWT token across page refreshes              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ProtectedRoute Component                    │  │
│  │  - Wraps pages requiring authentication                  │  │
│  │  - Redirects logged-out users to /auth                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  Pages: Home, Search, MovieDetail, Auth, Watchlist, Admin      │
└────────────────────────────────────────────────────────────────┘
│
│ JWT Token (in Authorization header)
│
▼
┌────────────────────────────────────────────────────────────────┐
│              Supabase Auth (Managed Service)                   │
│                                                                │
│  - Email/password registration & login                         │
│  - Google OAuth integration                                    │
│  - JWT token generation & validation                           │
│  - Session management                                          │
│  - Private auth.users table (ground truth)                     │
└────────────────────────────────────────────────────────────────┘
│
│ User ID (extracted from JWT)
│
▼
┌────────────────────────────────────────────────────────────────┐
│           Backend (Node.js + Express)                          │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Middleware: requireAuth.js                      │  │
│  │  - Verifies JWT token in Authorization header            │  │
│  │  - Extracts user ID from JWT claims                      │  │
│  │  - Passes user info to route handlers                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Middleware: requireAdmin.js                     │  │
│  │  - Checks if user.role === 'admin'                       │  │
│  │  - Blocks non-admin access to sensitive routes           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  Routes: /api/users, /api/watchlist, /api/reviews, etc.        │
└────────────────────────────────────────────────────────────────┘
│
│ User ID, watchlist data, reviews, ratings
│
▼
┌────────────────────────────────────────────────────────────────┐
│     AWS RDS PostgreSQL (Movie Watchlist Data)                  │
│                                                                │
│  Tables:                                                       │
│  - users (id, email, role, created_at)                         │
│  - watchlist (id, user_id, movie_id, added_date)               │
│  - reviews (id, user_id, movie_id, rating, text)               │
│  - comments (id, user_id, review_id, text)                     │
│                                                                │
│  All tables are keyed to Supabase user ID                      │
└────────────────────────────────────────────────────────────────┘
```


## Role-Based Access Control

**Standard User:**
- Manage own watchlist
- Rate and review movies
- Write comments

**Admin User:**
- All standard user permissions
- Moderate and delete flagged content
- Access admin dashboard

---

## Protected routes

Any route that requires authentication wraps its component with `ProtectedRoute`:

```jsx
<Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
```

If the user is not logged in, they're automatically redirected to `/auth`.

---