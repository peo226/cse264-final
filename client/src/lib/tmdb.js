const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`TMDb request failed: ${response.status}`)
  }

  return response.json()
}

function formatMovieSummary(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : '',
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'N/A',
    overview: movie.overview || 'No description available.',
  }
}

export async function getFeaturedMovies() {
  const result = await tmdbFetch('/discover/movie', {
    language: 'en-US',
    sort_by: 'popularity.desc',
    include_adult: false,
    page: 1,
  })

  return (result.results || []).slice(0, 6).map(formatMovieSummary)
}

export async function searchMovies(query) {
  const result = await tmdbFetch('/search/movie', {
    query,
    language: 'en-US',
    include_adult: false,
    page: 1,
  })

  return (result.results || []).map(formatMovieSummary)
}

export async function getMovieDetails(movieId) {
  const result = await tmdbFetch(`/movie/${movieId}`, {
    language: 'en-US',
    append_to_response: 'credits',
  })

  const director =
    result.credits?.crew?.find((person) => person.job === 'Director')?.name ||
    'Unknown'

  return {
    id: result.id,
    title: result.title,
    poster_url: result.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${result.poster_path}`
      : '',
    release_year: result.release_date
      ? new Date(result.release_date).getFullYear()
      : 'N/A',
    genre: Array.isArray(result.genres)
      ? result.genres.map((genre) => genre.name).join(', ')
      : '',
    director,
    runtime: result.runtime ? `${result.runtime} min` : 'N/A',
    overview: result.overview || 'No description available.',
  }
}