import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/Movies/SearchBar'
import MovieGrid from '../components/Movies/MovieGrid'
import { supabase } from '../lib/supabase'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSearchResults = async () => {
      setLoading(true)
      setError('')

      let query = supabase.from('movies').select('*')

      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`)
      }

      const { data, error } = await query.order('release_year', {
        ascending: false,
      })

      if (error) {
        setError('Unable to search movies right now.')
        setMovies([])
      } else {
        const normalizedMovies = (data || []).map((movie) => ({
          ...movie,
          poster: movie.poster_url,
          year: movie.release_year,
        }))

        setMovies(normalizedMovies)
      }

      setLoading(false)
    }

    loadSearchResults()
  }, [searchQuery])

  return (
    <section className="search-results-page">
      <div className="search-results-header">
        <h1 className="search-results-title">Search Results</h1>
        <p className="search-results-subtitle">
          {searchQuery
            ? `Showing results for "${searchQuery}"`
            : 'Browse all available movies.'}
        </p>
      </div>

      <SearchBar initialValue={searchQuery} />

      {loading ? (
        <div className="page-message">Loading search results...</div>
      ) : error ? (
        <div className="page-message error">{error}</div>
      ) : (
        <MovieGrid
          movies={movies}
          emptyMessage={`No movies found for "${searchQuery}".`}
        />
      )}
    </section>
  )
}

export default SearchResults