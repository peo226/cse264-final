import * as movieService from "../services/movieService.js";

const getMovieDetails = async (req, res, next) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    res.json(movie);
  } catch (err) {
    next(err); // Pass to error middleware
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

export { getMovieDetails, createMovie };
