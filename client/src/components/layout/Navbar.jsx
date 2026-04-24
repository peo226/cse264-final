import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Movie Watchlist
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/admin">Admin</Link>

        {user ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/auth">Login / Register</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar