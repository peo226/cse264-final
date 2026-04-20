# Movie Watchlist App

A web application where users can search for movies, build personal watchlists,
and share reviews with other users.

Built for CSE264 — Lehigh University.

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
- **External API:** TMDb (The Movie Database)

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

### 2. Set up environment variables

Copy the `.env` file shared by the team into the `server/` directory.
It should contain:

POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DBNAME=

> Never commit the `.env` file. It is listed in `.gitignore`.

### 3. Install dependencies

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
(update ports here if yours differ).

---

## Pages

| Page | Route | Auth required |
|------|-------|---------------|
| Home | `/` | No |
| Search Results | `/search` | No |
| Movie Detail | `/movies/:id` | No |
| Login / Register | `/auth` | No |
| Watchlist & Profile | `/watchlist` | Yes |
| Admin Dashboard | `/admin` | Admin only |

---

## User Roles

| Role | Permissions |
|------|-------------|
| Standard user | Manage watchlist, rate movies, write reviews and comments |
| Admin | All of the above + moderate and remove flagged content |

---

## Architecture Notes

- Authentication is handled with JWTs issued by the server on login. The token
  is stored client-side and sent with each request via the `Authorization` header.
- The TMDb external API is called from the **client** directly using a public
  API key for movie search and detail data.
- All user data (watchlists, ratings, reviews) is stored in the PostgreSQL
  database on AWS RDS.
- Protected routes on the server check the JWT and the user's role before
  allowing access.

---

## Git Workflow

- Branch naming: `feature/<short-description>` or `fix/<short-description>`
- Open a pull request to `main` when your feature is ready
- At least one teammate should review before merging