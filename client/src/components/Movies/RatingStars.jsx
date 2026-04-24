import { useState } from 'react'

function RatingStars({ initialRating = 0, onRatingChange }) {
  const [rating, setRating] = useState(initialRating)

  const handleClick = (selectedRating) => {
    setRating(selectedRating)

    if (onRatingChange) {
      onRatingChange(selectedRating)
    }
  }

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`rating-star ${star <= rating ? 'active' : ''}`}
          onClick={() => handleClick(star)}
        >
          ★
        </button>
      ))}

      <span className="rating-value">
        {rating > 0 ? `${rating}/5` : 'No rating yet'}
      </span>
    </div>
  )
}

export default RatingStars