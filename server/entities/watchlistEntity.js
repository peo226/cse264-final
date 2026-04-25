export const toWatchlistEntity = (row) => {
  if (!row) {
    return null;
  }

  return {
    user_id: row.user_id,
    movie_id: row.movie_id,
    title: row.title || null,
    poster_url: row.poster_url || null,
    created_at: row.created_at || null,
  };
};

export const toWatchlistEntities = (rows = []) => rows.map(toWatchlistEntity);
