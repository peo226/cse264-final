import * as movieRepository from "../repositories/movieRepository.js";

export const getAllMovies = async () => {
  return movieRepository.findAll();
};

export const getMovieById = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid movie ID");
  }

  const movie = await movieRepository.findById(id);
  if (!movie) {
    throw new Error("Movie not found");
  }

  return movie;
};

export const getMovieByTmdbId = async (tmdbId) => {
  if (!tmdbId || isNaN(tmdbId)) {
    throw new Error("Invalid TMDb movie ID");
  }

  const movie = await movieRepository.findByTmdbId(tmdbId);
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
  const exists = await movieRepository.findByTmdbId(tmdb_id);
  if (exists) {
    throw new Error("Movie already exists");
  }

  return movieRepository.create({ title, tmdb_id, poster_url });
};
