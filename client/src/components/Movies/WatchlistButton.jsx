import { useState } from 'react'

function WatchlistButton({ initialAdded = false, onToggle }) {
  const [isAdded, setIsAdded] = useState(initialAdded)

  const handleClick = () => {
    const nextValue = !isAdded
    setIsAdded(nextValue)

    if (onToggle) {
      onToggle(nextValue)
    }
  }

  return (
    <button
      type="button"
      className={`watchlist-button ${isAdded ? 'added' : ''}`}
      onClick={handleClick}
    >
      {isAdded ? 'Added to Watchlist' : 'Add to Watchlist'}
    </button>
  )
}

export default WatchlistButton