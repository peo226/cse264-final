import { useEffect, useState } from 'react'

function WatchlistButton({ initialAdded = false, onToggle }) {
  const [isAdded, setIsAdded] = useState(initialAdded)

  useEffect(() => {
    setIsAdded(initialAdded)
  }, [initialAdded])

  const handleClick = async () => {
    const nextValue = !isAdded

    if (onToggle) {
      const success = await onToggle(nextValue)
      if (success === false) return
    }

    setIsAdded(nextValue)
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