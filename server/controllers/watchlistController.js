import * as watchlistService from "../services/watchlistService.js";

const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await watchlistService.getWatchlistForUser(
      req.params.userId,
    );
    res.json(watchlist);
  } catch (err) {
    next(err);
  }
};

const addMovie = async (req, res, next) => {
  try {
    const watchlistItem = await watchlistService.addMovieToWatchlist({
      userId: req.body.userId,
      movieId: req.body.movieId,
    });

    res.status(201).json(watchlistItem);
  } catch (err) {
    next(err);
  }
};

const removeMovie = async (req, res, next) => {
  try {
    await watchlistService.removeMovieFromWatchlist({
      userId: req.params.userId,
      movieId: req.params.movieId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export { getWatchlist, addMovie, removeMovie };
