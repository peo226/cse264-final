import { query } from "../db/postgres.js";

export const findById = async (id) => {
  const result = await query(
    `SELECT id, email, username, role, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0] || null;
};

export const upsertUser = async ({
  id,
  email,
  username = null,
  role = "user",
}) => {
  const result = await query(
    `INSERT INTO users (id, email, username, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       username = COALESCE(EXCLUDED.username, users.username),
       updated_at = NOW()
     RETURNING id, email, username, role, created_at, updated_at`,
    [id, email, username, role],
  );

  return result.rows[0];
};

export const updateUser = async (id, updates) => {
  const result = await query(
    `UPDATE users
     SET username = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, email, username, role, created_at, updated_at`,
    [updates.username, id],
  );

  return result.rows[0] || null;
};

export const deleteUser = async (id) => {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [
    id,
  ]);
  return result.rows[0] || null;
};
