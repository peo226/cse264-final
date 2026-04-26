import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getMovieDetails } from '../lib/tmdb'

function Profile() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [watchlistCount, setWatchlistCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [favoriteGenre, setFavoriteGenre] = useState('N/A')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadProfileData = async () => {
      if (!user) {
        if (isMounted) setLoading(false)
        return
      }

      if (isMounted) setLoading(true)

      const { data: userRow, error: userError } = await supabase
        .from('users')
        .select('id, email, username, created_at')
        .eq('id', user.id)
        .maybeSingle()

      if (!isMounted) return

      if (userError) {
        console.error('Failed to load profile:', userError)
        setProfile(null)
        setLoading(false)
        return
      }

      if (!userRow) {
        console.error('No matching row found in public.users for this auth user.')
        setProfile(null)
        setLoading(false)
        return
      }

      setProfile(userRow)

      const { count: watchlistTotal, error: watchlistCountError } = await supabase
        .from('watchlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!isMounted) return

      if (watchlistCountError) {
        console.error('Failed to count watchlist:', watchlistCountError)
      }

      setWatchlistCount(watchlistTotal || 0)

      const { count: reviewTotal, error: reviewCountError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!isMounted) return

      if (reviewCountError) {
        console.error('Failed to count reviews:', reviewCountError)
      }

      setReviewCount(reviewTotal || 0)

      const { data: watchlistRows, error: watchlistRowsError } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', user.id)

      if (!isMounted) return

      if (watchlistRowsError) {
        console.error('Failed to load watchlist rows:', watchlistRowsError)
        setFavoriteGenre('N/A')
        setLoading(false)
        return
      }

      const movieIds = (watchlistRows || []).map((row) => row.movie_id)

      if (movieIds.length === 0) {
        setFavoriteGenre('N/A')
        setLoading(false)
        return
      }

      try {
        const movieDetails = await Promise.all(
          movieIds.map((movieId) => getMovieDetails(movieId))
        )

        if (!isMounted) return

        const genreCount = {}

        movieDetails.forEach((movie) => {
          if (!movie.genre) return

          const genres = movie.genre.split(',').map((item) => item.trim())

          genres.forEach((genre) => {
            if (!genre) return
            genreCount[genre] = (genreCount[genre] || 0) + 1
          })
        })

        const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1])

        setFavoriteGenre(sortedGenres.length > 0 ? sortedGenres[0][0] : 'N/A')
      } catch (error) {
        if (!isMounted) return
        console.error('Failed to calculate favorite genre:', error)
        setFavoriteGenre('N/A')
      }

      if (isMounted) setLoading(false)
    }

    loadProfileData()

    return () => {
      isMounted = false
    }
  }, [user])

  if (loading) {
    return <div className="page-message">Loading profile...</div>
  }

  if (!profile) {
    return <div className="page-message error">Unable to load profile.</div>
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {(profile.username || profile.email || 'U').charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h1 className="profile-title">{profile.username || 'User'}</h1>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-joined">
            Joined:{' '}
            {profile.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <h2 className="profile-stat-number">{watchlistCount}</h2>
          <p className="profile-stat-label">Movies in Watchlist</p>
        </div>

        <div className="profile-stat-card">
          <h2 className="profile-stat-number">{reviewCount}</h2>
          <p className="profile-stat-label">Reviews Written</p>
        </div>

        <div className="profile-stat-card">
          <h2 className="profile-stat-number">{favoriteGenre}</h2>
          <p className="profile-stat-label">Favorite Genre</p>
        </div>
      </div>
    </section>
  )
}

export default Profile