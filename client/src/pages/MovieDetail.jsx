import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import RatingStars from '../components/Movies/RatingStars'
import ReviewForm from '../components/Movies/ReviewForm'
import ReviewList from '../components/Movies/ReviewList'
import WatchlistButton from '../components/Movies/WatchlistButton'

function MovieDetail() {
  const { id } = useParams()

  const movies = [
    {
      id: 1,
      title: 'Inception',
      year: 2010,
      poster:
        'https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
      overview:
        'A skilled thief is offered a chance to erase his criminal history by planting an idea into a target’s subconscious through dream-sharing technology.',
      genre: 'Sci-Fi, Action, Thriller',
      director: 'Christopher Nolan',
      runtime: '148 min',
    },
    {
      id: 2,
      title: 'Interstellar',
      year: 2014,
      poster:
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      overview:
        'A team of explorers travels through a wormhole in space in an attempt to ensure humanity’s survival as Earth becomes increasingly uninhabitable.',
      genre: 'Sci-Fi, Drama, Adventure',
      director: 'Christopher Nolan',
      runtime: '169 min',
    },
    {
      id: 3,
      title: 'The Dark Knight',
      year: 2008,
      poster:
        'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      overview:
        'Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos and forces the hero to confront impossible moral choices.',
      genre: 'Action, Crime, Drama',
      director: 'Christopher Nolan',
      runtime: '152 min',
    },
    {
      id: 4,
      title: 'Parasite',
      year: 2019,
      poster:
        'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      overview:
        'A poor family gradually infiltrates the lives of a wealthy household, leading to unexpected consequences and a sharp critique of class inequality.',
      genre: 'Thriller, Drama',
      director: 'Bong Joon-ho',
      runtime: '132 min',
    },
    {
      id: 5,
      title: 'La La Land',
      year: 2016,
      poster:
        'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      overview:
        'A jazz pianist and an aspiring actress fall in love while struggling to balance their personal relationship with their professional ambitions.',
      genre: 'Romance, Drama, Music',
      director: 'Damien Chazelle',
      runtime: '128 min',
    },
    {
      id: 6,
      title: 'Everything Everywhere All at Once',
      year: 2022,
      poster:
        'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
      overview:
        'An overwhelmed laundromat owner is pulled into a multiverse-spanning adventure where she must connect with alternate versions of herself.',
      genre: 'Sci-Fi, Comedy, Adventure',
      director: 'Daniel Kwan & Daniel Scheinert',
      runtime: '139 min',
    },
  ]

  const movie = useMemo(() => {
    return movies.find((item) => String(item.id) === String(id))
  }, [id])

  const [reviews, setReviews] = useState([
    {
      id: 1,
      username: 'Alice',
      rating: 5,
      text: 'Amazing movie with a very creative concept and strong performances.',
    },
    {
      id: 2,
      username: 'Brian',
      rating: 4,
      text: 'Really enjoyable and visually impressive. I would definitely watch it again.',
    },
  ])

  const handleAddReview = (reviewText) => {
    const newReview = {
      id: Date.now(),
      username: 'Current User',
      rating: null,
      text: reviewText,
    }

    setReviews((prevReviews) => [newReview, ...prevReviews])
  }

  const handleRatingChange = (newRating) => {
    console.log('Selected rating:', newRating)
  }

  const handleWatchlistToggle = (isAdded) => {
    console.log('Watchlist status:', isAdded)
  }

  if (!movie) {
    return (
      <section className="movie-detail-page">
        <h1 className="movie-detail-title">Movie Not Found</h1>
        <p className="movie-detail-subtitle">
          The movie you are looking for does not exist.
        </p>
      </section>
    )
  }

  return (
    <section className="movie-detail-page">
      <div className="movie-detail-top">
        <div className="movie-detail-poster-wrapper">
          <img
            className="movie-detail-poster"
            src={movie.poster}
            alt={movie.title}
          />
        </div>

        <div className="movie-detail-info">
          <h1 className="movie-detail-title">{movie.title}</h1>
          <p className="movie-detail-subtitle">
            {movie.year} • {movie.genre}
          </p>

          <div className="movie-detail-meta">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Runtime:</strong> {movie.runtime}</p>
          </div>

          <p className="movie-detail-overview">{movie.overview}</p>

          <div className="movie-detail-actions">
            <WatchlistButton onToggle={handleWatchlistToggle} />
          </div>

          <div className="movie-detail-rating">
            <h2 className="movie-detail-section-title">Your Rating</h2>
            <RatingStars onRatingChange={handleRatingChange} />
          </div>
        </div>
      </div>

      <div className="movie-detail-reviews">
        <h2 className="movie-detail-section-title">Reviews</h2>
        <ReviewForm onSubmitReview={handleAddReview} />
        <ReviewList reviews={reviews} />
      </div>
    </section>
  )
}

export default MovieDetail