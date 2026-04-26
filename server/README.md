# Server Implementation

Vincent Zouras

## Overview

This server is an Express API for the movie watchlist app. It connects to a Postgres database for application data and verifies Supabase access tokens for authenticated requests.

The app starts from `app.js`, uses JSON request parsing and CORS, and exposes a simple health check at `/` that returns `Movie Watchlist API`.

## Structure

The backend follows a layered architecture:

```bash
server/
├── controllers/       # HTTP request/response handlers
├── db/                # Postgres connection
├── entities/          # Row-to-object mappers
├── lib/               # Supabase auth helpers
├── middleware/        # Auth and error handling
├── repositories/      # SQL queries and persistence
├── routes/             # Route definitions
├── services/           # Validation and business logic
└── app.js              # Express app entry point
```

## Layer Responsibilities

- Controllers translate HTTP requests into service calls and responses.
- Services validate input and coordinate repository calls.
- Repositories execute SQL and return database results.
- Middleware handles auth and centralized error responses.
- Routes stay thin and only attach controllers and middleware.

## Scripts

From the `server` directory:

```bash
npm install
npm run dev
npm start
```

`npm run dev` starts the server with `nodemon`, and `npm start` runs it with Node directly.

## Environment

Create a `server/.env` file with the Postgres credentials and Supabase settings used by the auth middleware and database client:

```bash
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DBNAME=
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

`SUPABASE_URL` is required for token verification. `SUPABASE_ANON_KEY` is also required by the Supabase client. For local development, the code also accepts `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as fallbacks.

## Authentication

`requireAuth` expects an `Authorization: Bearer <token>` header, verifies the Supabase access token, and attaches the current user to `req.user`.

`requireAdmin` also verifies the token, then looks up the user in Postgres and requires `users.role = 'admin'`.

## API Routes

### Base

- `GET /` returns `Movie Watchlist API`

### Movies

- `GET /movies` returns all movies
- `GET /movies/:id` returns a movie by internal ID
- `GET /movies/tmdb/:tmdbId` returns a movie by TMDb ID
- `POST /movies` creates a movie; admin only

Expected body for `POST /movies`:

```json
{
 "title": "Movie Title",
 "tmdb_id": 123,
 "poster_url": "https://..."
}
```

### Watchlist

- `GET /watchlist/:userId` returns a user's watchlist
- `POST /watchlist` adds a movie to a watchlist
- `DELETE /watchlist/:userId/:movieId` removes a movie from a watchlist

Current implementation note: these routes do not have route-level auth middleware attached, so the caller is responsible for sending the expected `userId` values.

Expected body for `POST /watchlist`:

```json
{
 "userId": "user-id",
 "movieId": 123
}
```

### Users

All `/users` routes require authentication.

- `GET /users/:id` returns the authenticated user's profile if the `:id` matches `req.user.id`
- `POST /users` creates or syncs the current Supabase user in Postgres
- `PATCH /users/:id` updates the authenticated user's username
- `DELETE /users/:id` deletes the authenticated user's row

Expected body for `POST /users`:

```json
{
 "username": "vincent",
 "role": "user"
}
```

Expected body for `PATCH /users/:id`:

```json
{
 "username": "new-name"
}
```

### Admin

All `/admin` routes require authentication and an admin role

- `GET /admin/users` returns all users
- `GET /admin/reviews` returns all reviews
- `DELETE /admin/reviews/:id` deletes a review

## Error Handling

Errors are handled by a shared middleware that returns JSON in the form `{ "error": "message" }` and uses the status code attached to the error when present.
