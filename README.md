# Movie Watchlist App

A web application where users can search for movies, build personal watchlists,
and share reviews with other users.


## Team

| Name | Role |
|------|------|
| Yixuan Miao | Frontend, React components, testing, deployment |
| Prince Omuyeh | Documentation, UI/UX, authentication, user system |
| Vincent Zouras | Backend, REST API, database design |

---

## Tech Stack

- **Frontend:** React + Vite, React Router, CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (AWS RDS)
- **Authentication:** Supabase Auth / JSON Web Tokens (JWT)
- **External API:** TMDb (The Movie Database), Google OAuth

---

## Project Structure

/  
├── client/          # React + Vite frontend  
└── server/          # Express backend  

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### 1. Clone the repo

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

**For Google OAuth (optional):**
- In Supabase dashboard, go to **Authentication → Providers → Google**
- Toggle it ON
- Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
- Add redirect URI: `https://your-supabase-url/auth/v1/callback`

### 3. Set up environment variables
**In `client/.env`:**
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

**In `server/.env`:**
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DBNAME=


> Never commit the `.env` file. It is listed in `.gitignore`.

### 4. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the app

Open two terminals:

**Terminal 1 — backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — frontend:**

```bash
cd client
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:3000`

---

## Pages

| Page | Route | Auth required | Role |
|------|-------|---------------|------|
| Home | `/` | No | Anyone |
| Search Results | `/search` | No | Anyone |
| Movie Detail | `/movie/:id` | No | Anyone |
| Login / Register | `/auth` | No | Anyone |
| Watchlist & Profile | `/watchlist` | Yes | User+ |
| Admin Dashboard | `/admin` | Yes | Admin only |

---

## User Roles

| Role | Permissions |
|------|-------------|
| Standard user | Manage watchlist, rate movies, write reviews and comments |
| Admin | All of the above + moderate and remove flagged content |

---

## Authentication Flow

1. User registers or logs in via email/password or Google OAuth
2. Supabase issues a JWT token
3. Token is stored in browser localStorage
4. Token is attached to requests via `Authorization: Bearer <token>` header
5. Protected routes (`/watchlist`, `/profile`, `/admin`) redirect unauthenticated users to `/auth`
6. Token persists across page refreshes via `AuthContext`

**Related files:**
- `client/src/lib/supabase.js` — Supabase client initialization
- `client/src/context/AuthContext.jsx` — Session state, login/logout/register functions
- `client/src/components/layout/ProtectedRoute.jsx` — Route protection middleware

---

## Architecture Notes

- **Frontend authentication** is handled entirely by Supabase. User sessions are managed in `AuthContext`.
- **Backend authentication** — Vincent's Express routes receive the Supabase JWT and verify it to identify the user. The JWT is sent via `Authorization` header with each request.
- **Database** — User account data lives in Supabase Auth. App data (watchlists, reviews, ratings) lives in AWS RDS PostgreSQL and is keyed to the Supabase user ID.
- **TMDb API** is called from the frontend directly for movie search and detail data.
- **Protected routes** on the server check the JWT and user role before allowing access.

---

