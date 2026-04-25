import { query } from "../db/postgres.js";
import { toMovieEntities, toMovieEntity } from "../entities/movieEntity.js";

export const findAll = async () => {
  const result = await query("SELECT * FROM movies ORDER BY id DESC");
  return toMovieEntities(result.rows);
};

export const findById = async (id) => {
  const result = await query("SELECT * FROM movies WHERE id = $1", [id]);
  return toMovieEntity(result.rows[0] || null);
};

export const findByTmdbId = async (tmdbId) => {
  const result = await query("SELECT * FROM movies WHERE tmdb_id = $1", [
    tmdbId,
  ]);
  return toMovieEntity(result.rows[0] || null);
};

export const create = async ({ title, tmdb_id, poster_url }) => {
  const result = await query(
    "INSERT INTO movies (title, tmdb_id, poster_url) VALUES ($1, $2, $3) RETURNING *",
    [title, tmdb_id, poster_url],
  );

  return toMovieEntity(result.rows[0]);
};