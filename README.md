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
- **Authentication:** Supabase Auth (JWT-based)
- **External APIs:** TMDb (The Movie Database), Google OAuth

---

## Quick Start

### Prerequisites

- Node.js v18+
- npm
- Supabase account (free tier)

### 1. Clone and setup

```bash
git clone 
cd 
```

### 2. Environment variables

**In `client/.env`:**

VITE_SUPABASE_URL=your_project_url

VITE_SUPABASE_ANON_KEY=your_anon_key

**In `server/.env`:**

POSTGRES_USERNAME=

POSTGRES_PASSWORD=

POSTGRES_HOST=

POSTGRES_PORT=

POSTGRES_DBNAME=

See [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) for detailed Supabase setup instructions.

### 3. Install and run

```bash
# Terminal 1 — backend
cd server && npm install && npm run dev

# Terminal 2 — frontend
cd client && npm install && npm run dev
```

Client: `http://localhost:5173` | Server: `http://localhost:3000`

---

## Pages

| Page | Route | Auth required |
|------|-------|---------------|
| Home | `/` | No |
| Search Results | `/search` | No |
| Movie Detail | `/movie/:id` | No |
| Login / Register | `/auth` | No |
| Watchlist & Profile | `/watchlist` | Yes |
| Admin Dashboard | `/admin` | Yes (Admin only) |

---

## Documentation

- [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) — Supabase setup, auth flow, JWT explanation
- [`docs/USER_ROLES.md`](docs/USER_ROLES.md) — User roles and permissions

---

## Project Structure
# Project Structure

```
movie-watchlist-app/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── GoogleAuthButton.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── shared/              # Shared components (movie cards, etc.)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── MovieDetail.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Watchlist.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # User session state
│   │   ├── lib/
│   │   │   └── supabase.js          # Supabase client initialization
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env                         # Environment variables (never commit)
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── routes/
│   │   ├── users.js                 # User endpoints
│   │   ├── watchlist.js             # Watchlist endpoints
│   │   ├── reviews.js               # Reviews endpoints
│   │   └── movies.js                # Movie endpoints
│   ├── middleware/
│   │   ├── requireAuth.js           # JWT verification
│   │   └── requireAdmin.js          # Admin role check
│   ├── .env                         # Database credentials (never commit)
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── docs/                            # Documentation
│   ├── ... .md
│
├── README.md                        # Main documentation
└── .gitignore
```