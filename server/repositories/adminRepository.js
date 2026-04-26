import { query } from "../db/postgres.js";

export const findAllUsers = async () => {
  const result = await query(
    `SELECT id, email, username, role, created_at, updated_at
     FROM users
     ORDER BY created_at DESC NULLS LAST, email ASC`
  );

  return result.rows;
};

export const findAllReviews = async () => {
  const result = await query(
    `SELECT
       r.id,
       r.review_text,
       r.created_at,
       r.movie_id,
       u.email,
       u.username
     FROM reviews r
     LEFT JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC NULLS LAST, r.id DESC`
  );

  return result.rows;
};

export const removeReview = async (id) => {
  const result = await query(
    `DELETE FROM reviews
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
};