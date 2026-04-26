import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import RatingStars from "../components/Movies/RatingStars";
import ReviewForm from "../components/Movies/ReviewForm";
import ReviewList from "../components/Movies/ReviewList";
import WatchlistButton from "../components/Movies/WatchlistButton";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { getMovieDetails } from "../lib/tmdb";

function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const movieId = useMemo(() => Number(id), [id]);

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const loadMovieDetail = async () => {
      if (Number.isNaN(movieId)) {
        setError("Invalid movie id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        setError("Unable to load movie details right now.");
        setMovie(null);
        setLoading(false);
        return;
      }

      const { data: reviewRows, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .eq("movie_id", movieId)
        .order("created_at", { ascending: false });

      if (reviewError) {
        console.error("Failed to load reviews:", reviewError);
        setReviews([]);
      } else {
        const userIds = [...new Set((reviewRows || []).map((r) => r.user_id))];
        let userMap = {};

        if (userIds.length > 0) {
          const { data: userRows, error: userRowsError } = await supabase
            .from("users")
            .select("id, username, email")
            .in("id", userIds);

          if (userRowsError) {
            console.error("Failed to load review users:", userRowsError);
          }

          userMap = Object.fromEntries(
            (userRows || []).map((row) => [
              row.id,
              row.username || row.email || "User",
            ])
          );
        }

        const formattedReviews = (reviewRows || []).map((review) => ({
          id: review.id,
          username: userMap[review.user_id] || "User",
          rating: null,
          text: review.review_text,
        }));

        setReviews(formattedReviews);
      }

      if (user) {
        const { data: ratingRow, error: ratingError } = await supabase
          .from("ratings")
          .select("*")
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .maybeSingle();

        if (ratingError) {
          console.error("Failed to load user rating:", ratingError);
        }

        setUserRating(ratingRow?.rating_value || 0);

        const { data: watchlistRow, error: watchlistError } = await supabase
          .from("watchlist")
          .select("movie_id")
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .maybeSingle();

        if (watchlistError) {
          console.error("Failed to check watchlist status:", watchlistError);
        }

        setIsInWatchlist(!!watchlistRow);
      } else {
        setUserRating(0);
        setIsInWatchlist(false);
      }

      setLoading(false);
    };

    loadMovieDetail();
  }, [movieId, user]);

  const handleAddReview = async (reviewText) => {
    if (!user) return;

    const { data: profileRow, error: profileError } = await supabase
      .from("users")
      .select("username, email")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Failed to load profile info for review:", profileError);
    }

    const { error: reviewInsertError } = await supabase.from("reviews").insert({
      user_id: user.id,
      movie_id: movieId,
      review_text: reviewText,
    });

    if (reviewInsertError) {
      console.error("Failed to submit review:", reviewInsertError);
      return;
    }

    const reviewerName =
      profileRow?.username ||
      profileRow?.email ||
      user.email ||
      "Current User";

    setReviews((prevReviews) => [
      {
        id: Date.now(),
        username: reviewerName,
        rating: null,
        text: reviewText,
      },
      ...prevReviews,
    ]);
  };

  const handleRatingChange = async (newRating) => {
    if (!user) return;

    const { error: ratingUpsertError } = await supabase.from("ratings").upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        rating_value: newRating,
      },
      { onConflict: "user_id,movie_id" }
    );

    if (ratingUpsertError) {
      console.error("Failed to save rating:", ratingUpsertError);
      return;
    }

    setUserRating(newRating);
  };

  const handleWatchlistToggle = async (nextValue) => {
    if (!user || !movie || watchlistLoading) return false;

    setWatchlistLoading(true);

    if (nextValue) {
      const { error: movieUpsertError } = await supabase.from("movies").upsert(
        {
          tmdb_id: movie.id,
          title: movie.title,
          poster_url: movie.poster_url,
        },
        { onConflict: "tmdb_id" }
      );

      if (movieUpsertError) {
        console.error(
          "Failed to save movie into movies table:",
          movieUpsertError
        );
        setWatchlistLoading(false);
        return false;
      }

      const { error: watchlistInsertError } = await supabase
        .from("watchlist")
        .insert({
          user_id: user.id,
          movie_id: movie.id,
        });

      if (watchlistInsertError) {
        console.error("Failed to add to watchlist:", watchlistInsertError);
        setWatchlistLoading(false);
        return false;
      }

      setIsInWatchlist(true);
      setWatchlistLoading(false);
      return true;
    } else {
      const { error: watchlistDeleteError } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);

      if (watchlistDeleteError) {
        console.error(
          "Failed to remove from watchlist:",
          watchlistDeleteError
        );
        setWatchlistLoading(false);
        return false;
      }

      setIsInWatchlist(false);
      setWatchlistLoading(false);
      return true;
    }
  };

  if (loading) {
    return <div className="page-message">Loading movie details...</div>;
  }

  if (error || !movie) {
    return (
      <div className="page-message error">
        {error || "Unable to load movie details right now."}
      </div>
    );
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
              <strong>Director:</strong> {movie.director || "Unknown"}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.runtime || "N/A"}
            </p>
          </div>

          <p className="movie-detail-overview">{movie.overview}</p>

          <div className="movie-detail-actions">
            <WatchlistButton
              initialAdded={isInWatchlist}
              onToggle={handleWatchlistToggle}
            />
            {watchlistLoading && (
              <span className="inline-note">Updating watchlist...</span>
            )}
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
  );
}

export default MovieDetail;