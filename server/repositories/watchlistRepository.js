import { query } from "../db/postgres.js";
import {
  toWatchlistEntities,
  toWatchlistEntity,
} from "../entities/watchlistEntity.js";

export const findByUserId = async (userId) => {
  const result = await query(
    `SELECT
       w.user_id,
       w.movie_id,
       w.created_at,
       m.title,
       m.poster_url
     FROM watchlist w
     LEFT JOIN movies m ON m.tmdb_id = w.movie_id
     WHERE w.user_id = $1
     ORDER BY m.title ASC NULLS LAST, w.movie_id ASC`,
    [userId],
  );

  return toWatchlistEntities(result.rows);
};

export const findByUserIdAndMovieId = async (userId, movieId) => {
  const result = await query(
    `SELECT
       w.user_id,
       w.movie_id,
       w.created_at,
       m.title,
       m.poster_url
     FROM watchlist w
     LEFT JOIN movies m ON m.tmdb_id = w.movie_id
     WHERE w.user_id = $1 AND w.movie_id = $2`,
    [userId, movieId],
  );

  return toWatchlistEntity(result.rows[0] || null);
};

export const add = async ({ userId, movieId }) => {
  await query(
    `INSERT INTO watchlist (user_id, movie_id, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id, movie_id) DO NOTHING`,
    [userId, movieId],
  );

  return findByUserIdAndMovieId(userId, movieId);
};

export const remove = async ({ userId, movieId }) => {
  const result = await query(
    `DELETE FROM watchlist
     WHERE user_id = $1 AND movie_id = $2
     RETURNING user_id, movie_id`,
    [userId, movieId],
  );

  return result.rows[0] || null;
};
