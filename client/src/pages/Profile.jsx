function Profile() {
  const userProfile = {
    username: 'MovieFan01',
    email: 'moviefan01@example.com',
    joinDate: 'April 2026',
    watchlistCount: 12,
    reviewCount: 5,
    favoriteGenre: 'Sci-Fi',
  }

  return (
    <section className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {userProfile.username.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h1 className="profile-title">{userProfile.username}</h1>
          <p className="profile-email">{userProfile.email}</p>
          <p className="profile-joined">Joined: {userProfile.joinDate}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat-card">
          <h2 className="profile-stat-number">{userProfile.watchlistCount}</h2>
          <p className="profile-stat-label">Movies in Watchlist</p>
        </div>

        <div className="profile-stat-card">
          <h2 className="profile-stat-number">{userProfile.reviewCount}</h2>
          <p className="profile-stat-label">Reviews Written</p>
        </div>

        <div className="profile-stat-card">
          <h2 className="profile-stat-number">{userProfile.favoriteGenre}</h2>
          <p className="profile-stat-label">Favorite Genre</p>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">About This User</h2>
        <p className="profile-section-text">
          This profile page shows basic user information and activity summary.
          Later, it can be connected to real authentication and database data.
        </p>
      </div>
    </section>
  )
}

export default Profile