import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, username, role, created_at")
        .order("created_at", { ascending: false });

      if (usersError) {
        throw usersError;
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, user_id, movie_id, review_text, created_at")
        .order("created_at", { ascending: false });

      if (reviewsError) {
        throw reviewsError;
      }

      const userIds = [...new Set((reviewsData || []).map((review) => review.user_id))];

      let reviewUsers = [];
      if (userIds.length > 0) {
        const { data: reviewUserRows, error: reviewUsersError } = await supabase
          .from("users")
          .select("id, email, username")
          .in("id", userIds);

        if (reviewUsersError) {
          throw reviewUsersError;
        }

        reviewUsers = reviewUserRows || [];
      }

      const reviewUserMap = Object.fromEntries(
        reviewUsers.map((user) => [
          user.id,
          {
            email: user.email,
            username: user.username,
          },
        ])
      );

      const mergedReviews = (reviewsData || []).map((review) => ({
        ...review,
        email: reviewUserMap[review.user_id]?.email || null,
        username: reviewUserMap[review.user_id]?.username || null,
      }));

      setUsers(usersData || []);
      setReviews(mergedReviews);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError("Unable to load admin data.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        throw error;
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review.");
    }
  };

  if (loading) {
    return <div className="page-message">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="page-message error">{error}</div>;
  }

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-section">
        <h2>All Users</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-list">
            {users.map((user) => (
              <div key={user.id} className="admin-card">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Username:</strong> {user.username || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2>All Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="admin-list">
            {reviews.map((review) => (
              <div key={review.id} className="admin-card">
                <p>
                  <strong>User:</strong>{" "}
                  {review.username || review.email || "Unknown"}
                </p>
                <p>
                  <strong>Movie ID:</strong> {review.movie_id}
                </p>
                <p>
                  <strong>Review:</strong> {review.review_text}
                </p>
                <button onClick={() => handleDeleteReview(review.id)}>
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;