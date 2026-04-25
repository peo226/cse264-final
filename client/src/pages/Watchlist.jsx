import { useEffect, useState } from 'react'
import MovieGrid from '../components/Movies/MovieGrid'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { getMovieDetails } from '../lib/tmdb'

function Watchlist() {
  const { user } = useAuth()

  const [watchlistMovies, setWatchlistMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWatchlist = async () => {
    if (!user) {
      setWatchlistMovies([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data: watchlistRows, error: watchlistError } = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', user.id)

    if (watchlistError) {
      setError('Unable to load watchlist.')
      setWatchlistMovies([])
      setLoading(false)
      return
    }

    const movieIds = (watchlistRows || []).map((row) => row.movie_id)

    if (movieIds.length === 0) {
      setWatchlistMovies([])
      setLoading(false)
      return
    }

    try {
      const movieDetails = await Promise.all(
        movieIds.map(async (movieId) => {
          const movie = await getMovieDetails(movieId)
          return {
            ...movie,
            poster: movie.poster_url,
            year: movie.release_year,
          }
        })
      )

      setWatchlistMovies(movieDetails)
    } catch (err) {
      setError('Unable to load watchlist movies.')
      setWatchlistMovies([])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadWatchlist()
  }, [user])

  const handleRemoveMovie = async (movieToRemove) => {
    if (!user) return

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieToRemove.id)

    if (!error) {
      setWatchlistMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieToRemove.id)
      )
    }
  }

  return (
    <section className="watchlist-page">
      <div className="watchlist-header">
        <h1 className="watchlist-title">My Watchlist</h1>
        <p className="watchlist-subtitle">
          Keep track of the movies you want to watch.
        </p>
      </div>

      {loading ? (
        <div className="page-message">Loading watchlist...</div>
      ) : error ? (
        <div className="page-message error">{error}</div>
      ) : (
        <MovieGrid
          movies={watchlistMovies}
          showRemove={true}
          onRemove={handleRemoveMovie}
          emptyMessage="Your watchlist is empty."
        />
      )}
    </section>
  )
}

export default Watchlist