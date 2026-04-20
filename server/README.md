# Server Implementation

Vincent Zouras

## Structure

Following a layered architecture:

```bash
server/
├── controllers/       # Handle HTTP requests/responses
├── services/          # Business logic
├── models/            # Database queries & schemas
├── middleware/        # Auth, validation, error handling
├── routes/            # Route definitions (minimal)
├── utils/             # Helpers, validators, constants
├── db/                # Database connection
└── app.js
```
