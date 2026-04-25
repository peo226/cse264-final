import MovieCard from './MovieCard'

function MovieGrid({
  movies = [],
  emptyMessage = 'No movies found.',
  showRemove = false,
  onRemove,
  actionLabel = 'View Details',
}) {
  if (!movies || movies.length === 0) {
    return <p className="movie-grid-empty">{emptyMessage}</p>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        const movieKey = movie.id ?? movie.tmdb_id

        return (
          <MovieCard
            key={movieKey}
            movie={movie}
            showRemove={showRemove}
            onRemove={onRemove}
            actionLabel={actionLabel}
          />
        )
      })}
    </div>
  )
}

export default MovieGrid