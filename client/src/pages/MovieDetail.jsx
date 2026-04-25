import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import RatingStars from '../components/Movies/RatingStars'
import ReviewForm from '../components/Movies/ReviewForm'
import ReviewList from '../components/Movies/ReviewList'
import WatchlistButton from '../components/Movies/WatchlistButton'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function MovieDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const movieId = useMemo(() => Number(id), [id])

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userRating, setUserRating] = useState(0)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMovieDetail = async () => {
      setLoading(true)
      setError('')

      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', movieId)
        .single()

      if (movieError || !movieData) {
        setError('Movie not found.')
        setMovie(null)
        setLoading(false)
        return
      }

      setMovie(movieData)

      const { data: reviewRows, error: reviewError } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false })

      if (reviewError) {
        setReviews([])
      } else {
        const userIds = [...new Set((reviewRows || []).map((r) => r.user_id))]
        let userMap = {}

        if (userIds.length > 0) {
          const { data: userRows } = await supabase
            .from('users')
            .select('id, username, email')
            .in('id', userIds)

          userMap = Object.fromEntries(
            (userRows || []).map((row) => [
              row.id,
              row.username || row.email || 'User',
            ])
          )
        }

        const formattedReviews = (reviewRows || []).map((review) => ({
          id: review.id,
          username: userMap[review.user_id] || 'User',
          rating: null,
          text: review.review_text,
        }))

        setReviews(formattedReviews)
      }

      if (user) {
        const { data: ratingRow } = await supabase
          .from('ratings')
          .select('*')
          .eq('user_id', user.id)
          .eq('movie_id', movieId)
          .maybeSingle()

        setUserRating(ratingRow?.rating_value || 0)

        const { data: watchlistRow } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('movie_id', movieId)
          .maybeSingle()

        setIsInWatchlist(!!watchlistRow)
      } else {
        setUserRating(0)
        setIsInWatchlist(false)
      }

      setLoading(false)
    }

    if (!Number.isNaN(movieId)) {
      loadMovieDetail()
    } else {
      setError('Invalid movie id.')
      setLoading(false)
    }
  }, [movieId, user])

  const handleAddReview = async (reviewText) => {
    if (!user) return

    const { data: profileRow } = await supabase
      .from('users')
      .select('username, email')
      .eq('id', user.id)
      .single()

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      movie_id: movieId,
      review_text: reviewText,
    })

    if (!error) {
      const reviewerName =
        profileRow?.username || profileRow?.email || user.email || 'Current User'

      setReviews((prevReviews) => [
        {
          id: Date.now(),
          username: reviewerName,
          rating: null,
          text: reviewText,
        },
        ...prevReviews,
      ])
    }
  }

  const handleRatingChange = async (newRating) => {
    if (!user) return

    await supabase.from('ratings').upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        rating_value: newRating,
      },
      { onConflict: 'user_id,movie_id' }
    )

    setUserRating(newRating)
  }

  const handleWatchlistToggle = async (nextValue) => {
    if (!user) return

    if (nextValue) {
      await supabase.from('watchlist').insert({
        user_id: user.id,
        movie_id: movieId,
      })
      setIsInWatchlist(true)
    } else {
      await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId)

      setIsInWatchlist(false)
    }
  }

  if (loading) {
    return <div className="page-message">Loading movie details...</div>
  }

  if (error || !movie) {
    return (
      <div className="page-message error">{error || 'Movie not found.'}</div>
    )
  }

  return (
    <section className="movie-detail-page">
      <div className="movie-detail-top">
        <div className="movie-detail-poster-wrapper">
          <img
            className="movie-detail-poster"
            src={movie.poster_url}
            alt={movie.title}
          />
        </div>

        <div className="movie-detail-info">
          <h1 className="movie-detail-title">{movie.title}</h1>
          <p className="movie-detail-subtitle">
            {movie.release_year} • {movie.genre}
          </p>

          <div className="movie-detail-meta">
            <p>
              <strong>Director:</strong> {movie.director || 'Unknown'}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.runtime || 'N/A'}
            </p>
          </div>

          <p className="movie-detail-overview">{movie.overview}</p>

          <div className="movie-detail-actions">
            <WatchlistButton
              initialAdded={isInWatchlist}
              onToggle={handleWatchlistToggle}
            />
          </div>

          <div className="movie-detail-rating">
            <h2 className="movie-detail-section-title">Your Rating</h2>
            <RatingStars
              initialRating={userRating}
              onRatingChange={handleRatingChange}
            />
          </div>
        </div>
      </div>

      <div className="movie-detail-reviews">
        <h2 className="movie-detail-section-title">Reviews</h2>

        {user ? (
          <ReviewForm onSubmitReview={handleAddReview} />
        ) : (
          <div className="inline-note">Sign in to leave a review.</div>
        )}

        <ReviewList reviews={reviews} />
      </div>
    </section>
  )
}

export default MovieDetail