import { query } from "../db/postgres.js";

export const findById = async (id) => {
  const result = await query("SELECT * FROM movies WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const findByTmdbId = async (tmdb_id) => {
  const result = await query("SELECT * FROM movies WHERE tmdb_id = $1", [
    tmdb_id,
  ]);
  return result.rows[0] || null;
};

export const createMovie = async (data) => {
  const { title, tmdb_id, poster_url } = data;
  const result = await query(
    "INSERT INTO movies (title, tmdb_id, poster_url) VALUES ($1, $2, $3) RETURNING *",
    [title, tmdb_id, poster_url],
  );
  return result.rows[0];
};
