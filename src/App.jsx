import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import MovieDetail from './pages/MovieDetail'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <div className="web-shell">
      <Navbar />

      <main className="web-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App