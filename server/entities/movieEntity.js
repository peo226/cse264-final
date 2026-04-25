export const toMovieEntity = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    tmdb_id: row.tmdb_id,
    title: row.title,
    poster_url: row.poster_url || null,
  };
};

export const toMovieEntities = (rows = []) => rows.map(toMovieEntity);
