# User Roles

This app has two user roles with different permissions.

## Standard User

- Create and manage personal watchlist
- Rate movies (1-5 stars)
- Write reviews
- Post comments on reviews
- View other users' watchlists and reviews
- Browse public content

## Admin

- All permissions of a standard user, **plus:**
- View flagged/reported reviews and comments
- Delete inappropriate content
- Warn or suspend users
- Access admin dashboard

---

## Implementation

User role is stored in the `users` table in AWS RDS:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR,
  username VARCHAR,
  role VARCHAR DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP,
  ...
);
```

On the frontend, protected routes check the user's role:

```jsx
<Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
```

On the backend, protected endpoints check the JWT and verify `role === 'admin'` before allowing access.

---