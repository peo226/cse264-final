import { useEffect, useState } from 'react'
import SearchBar from '../components/Movies/SearchBar'
import MovieGrid from '../components/Movies/MovieGrid'
import { supabase } from '../lib/supabase'

function Home() {
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        setError('Unable to load featured movies right now.')
        setFeaturedMovies([])
      } else {
        const normalizedMovies = (data || []).map((movie) => ({
          ...movie,
          poster: movie.poster_url,
          year: movie.release_year,
        }))

        setFeaturedMovies(normalizedMovies)
      }

      setLoading(false)
    }

    loadFeaturedMovies()
  }, [])

  return (
    <section className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Movie Watchlist App</h1>
        <p className="home-subtitle">
          Search movies, explore details, and build your personal watchlist.
        </p>
      </div>

      <SearchBar />

      <div className="home-section">
        <h2 className="home-section-title">Featured Movies</h2>

        {loading ? (
          <div className="page-message">Loading featured movies...</div>
        ) : error ? (
          <div className="page-message error">{error}</div>
        ) : (
          <MovieGrid
            movies={featuredMovies}
            emptyMessage="No featured movies available."
          />
        )}
      </div>
    </section>
  )
}

export default Home