import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/Movies/SearchBar'
import MovieGrid from '../components/Movies/MovieGrid'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const allMovies = [
    {
      id: 1,
      title: 'Inception',
      year: 2010,
      poster:
        'https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
      overview:
        'A skilled thief is offered a chance to erase his criminal history by planting an idea into a target’s subconscious through dream-sharing technology.',
    },
    {
      id: 2,
      title: 'Interstellar',
      year: 2014,
      poster:
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      overview:
        'A team of explorers travels through a wormhole in space in an attempt to ensure humanity’s survival as Earth becomes increasingly uninhabitable.',
    },
    {
      id: 3,
      title: 'The Dark Knight',
      year: 2008,
      poster:
        'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      overview:
        'Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos and forces the hero to confront impossible moral choices.',
    },
    {
      id: 4,
      title: 'Parasite',
      year: 2019,
      poster:
        'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      overview:
        'A poor family gradually infiltrates the lives of a wealthy household, leading to unexpected consequences and a sharp critique of class inequality.',
    },
    {
      id: 5,
      title: 'La La Land',
      year: 2016,
      poster:
        'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      overview:
        'A jazz pianist and an aspiring actress fall in love while struggling to balance their personal relationship with their professional ambitions.',
    },
    {
      id: 6,
      title: 'Everything Everywhere All at Once',
      year: 2022,
      poster:
        'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
      overview:
        'An overwhelmed laundromat owner is pulled into a multiverse-spanning adventure where she must connect with alternate versions of herself.',
    },
  ]

  const filteredMovies = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase()

    if (!trimmedQuery) {
      return allMovies
    }

    return allMovies.filter((movie) => {
      const titleMatch = movie.title.toLowerCase().includes(trimmedQuery)
      const overviewMatch = movie.overview.toLowerCase().includes(trimmedQuery)
      const yearMatch = String(movie.year).includes(trimmedQuery)

      return titleMatch || overviewMatch || yearMatch
    })
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

      <MovieGrid
        movies={filteredMovies}
        emptyMessage={`No movies found for "${searchQuery}".`}
      />
    </section>
  )
}

export default SearchResults