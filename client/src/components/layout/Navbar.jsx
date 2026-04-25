import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("id, email, username, role")
        .eq("id", user.id)
        .single();

      setProfile(data || null);
    };

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName = profile?.username || user?.email || "User";
  const canSeeAdmin = profile?.role === "admin";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Movie Watchlist
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {user && canSeeAdmin && <Link to="/admin">Admin</Link>}

        {user ? (
          <>
            <span className="navbar-user">{displayName}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login / Register</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
