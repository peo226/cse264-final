import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/Movies/SearchBar'
import MovieGrid from '../components/Movies/MovieGrid'
import { searchMovies } from '../lib/tmdb'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!searchQuery.trim()) {
        setMovies([])
        setLoading(false)
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        const results = await searchMovies(searchQuery)
        setMovies(results)
      } catch (err) {
        setError('Unable to search movies right now.')
        setMovies([])
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
            : 'Enter a movie title to search.'}
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
          emptyMessage={
            searchQuery
              ? `No movies found for "${searchQuery}".`
              : 'Search for a movie to see results.'
          }
        />
      )}
    </section>
  )
}

export default SearchResults