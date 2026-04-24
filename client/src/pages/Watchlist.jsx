import { useState } from 'react'
import MovieGrid from '../components/Movies/MovieGrid'

function Watchlist() {
  const [watchlistMovies, setWatchlistMovies] = useState([
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
      id: 4,
      title: 'Parasite',
      year: 2019,
      poster:
        'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      overview:
        'A poor family gradually infiltrates the lives of a wealthy household, leading to unexpected consequences and a sharp critique of class inequality.',
    },
  ])

  const handleRemoveMovie = (movieToRemove) => {
    setWatchlistMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieToRemove.id)
    )
  }

  return (
    <section className="watchlist-page">
      <div className="watchlist-header">
        <h1 className="watchlist-title">My Watchlist</h1>
        <p className="watchlist-subtitle">
          Keep track of the movies you want to watch.
        </p>
      </div>

      <MovieGrid
        movies={watchlistMovies}
        showRemove={true}
        onRemove={handleRemoveMovie}
        emptyMessage="Your watchlist is empty."
      />
    </section>
  )
}

export default Watchlist