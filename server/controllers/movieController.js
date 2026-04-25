import * as movieService from "../services/movieService.js";

const getMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies();
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

const getMovieDetails = async (req, res, next) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    res.json(movie);
  } catch (err) {
    next(err); // Pass to error middleware
  }
};

const getMovieByTmdbId = async (req, res, next) => {
  try {
    const movie = await movieService.getMovieByTmdbId(req.params.tmdbId);
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await movieService.createMovie(req.body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

export { getMovies, getMovieDetails, getMovieByTmdbId, createMovie };
