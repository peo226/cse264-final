import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import MovieDetail from './pages/MovieDetail'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'
import './App.css'

function App() {
  return (
    <div className="web-shell">
      <Navbar />

      <main className="web-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </div>
  )
}

export default App