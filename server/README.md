# Server Implementation

Vincent Zouras

## Structure

Following a layered architecture:

```bash
server/
├── entities/          # Plain data mappers for database rows
├── repositories/      # Database queries and persistence logic
├── services/          # Business logic and validation
├── controllers/       # HTTP request/response handlers
├── routes/            # Route definitions
├── middleware/        # Auth, validation, error handling
├── db/                # Database connection
├── lib/               # Supabase/JWT helpers
└── app.js             # Express app entry point
```

## Layer Responsibilities

- Entities convert raw database rows into clean application objects.
- Repositories own SQL and return entity-shaped data.
- Services apply business rules and coordinate repository calls.
- Controllers translate HTTP requests into service calls and responses.
- Routes stay thin and only attach controllers and middleware.

## Environment

The backend verifies Supabase JWT access tokens, so it needs the project URL in `server/.env`.

```bash
SUPABASE_URL=https://your-project.supabase.co
```

If you prefer, `VITE_SUPABASE_URL` also works as a fallback for local development.
