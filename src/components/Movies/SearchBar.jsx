import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar({
  initialValue = '',
  placeholder = 'Search movies by title...',
}) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) return

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-bar-input"
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button className="search-bar-button" type="submit">
        Search
      </button>
    </form>
  )
}

export default SearchBar