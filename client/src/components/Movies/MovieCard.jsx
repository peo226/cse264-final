import { Link } from 'react-router-dom'

function MovieCard({
  movie,
  showRemove = false,
  onRemove,
  actionLabel = 'View Details',
}) {
  if (!movie) return null

  const movieId = movie.id ?? movie.tmdb_id ?? ''
  const title = movie.title ?? 'Untitled Movie'
  const year =
    movie.year ??
    movie.release_year ??
    (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A')
  const poster =
    movie.poster ??
    movie.poster_url ??
    'https://via.placeholder.com/300x450?text=No+Image'
  const overview =
    movie.overview ??
    movie.description ??
    'No description available.'

  const shortOverview =
    overview.length > 120 ? `${overview.slice(0, 120)}...` : overview

  const handleRemove = () => {
    if (onRemove) onRemove(movie)
  }

  return (
    <div className="movie-card">
      <img
        className="movie-card-poster"
        src={poster}
        alt={title}
        onError={(event) => {
          event.currentTarget.src =
            'https://via.placeholder.com/300x450?text=No+Image'
        }}
      />

      <div className="movie-card-body">
        <div className="movie-card-text">
          <h3 className="movie-card-title">{title}</h3>
          <p className="movie-card-year">{year}</p>
          <p className="movie-card-overview">{shortOverview}</p>
        </div>

        <div className="movie-card-actions">
          <Link to={`/movie/${movieId}`} className="movie-card-link">
            {actionLabel}
          </Link>

          {showRemove && (
            <button
              type="button"
              className="movie-card-remove"
              onClick={handleRemove}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard