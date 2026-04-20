import * as movieModel from "../models/movieModel.js";

export const getMovieById = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid movie ID");
  }

  const movie = await movieModel.findById(id);
  if (!movie) {
    throw new Error("Movie not found");
  }

  return movie;
};

export const createMovie = async (data) => {
  const { title, tmdb_id, poster_url } = data;

  // Validation
  if (!title || !tmdb_id) {
    throw new Error("Missing required fields");
  }

  // Check for duplicates
  const exists = await movieModel.findByTmdbId(tmdb_id);
  if (exists) {
    throw new Error("Movie already exists");
  }

  return movieModel.createMovie({ title, tmdb_id, poster_url });
};
