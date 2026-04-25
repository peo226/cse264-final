import * as watchlistRepository from "../repositories/watchlistRepository.js";

const parseMovieId = (movieId) => {
  const parsedMovieId = Number(movieId);

  if (!movieId || Number.isNaN(parsedMovieId)) {
    const error = new Error("Valid movie id is required");
    error.status = 400;
    throw error;
  }

  return parsedMovieId;
};

const requireUserId = (userId) => {
  if (!userId) {
    const error = new Error("User id is required");
    error.status = 400;
    throw error;
  }

  return userId;
};

export const getWatchlistForUser = async (userId) => {
  return watchlistRepository.findByUserId(requireUserId(userId));
};

export const addMovieToWatchlist = async ({ userId, movieId }) => {
  return watchlistRepository.add({
    userId: requireUserId(userId),
    movieId: parseMovieId(movieId),
  });
};

export const removeMovieFromWatchlist = async ({ userId, movieId }) => {
  const deletedItem = await watchlistRepository.remove({
    userId: requireUserId(userId),
    movieId: parseMovieId(movieId),
  });

  if (!deletedItem) {
    const error = new Error("Watchlist item not found");
    error.status = 404;
    throw error;
  }

  return deletedItem;
};
