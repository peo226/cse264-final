import { useState } from 'react'

function ReviewForm({ onSubmitReview }) {
  const [reviewText, setReviewText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedReview = reviewText.trim()

    if (!trimmedReview) return

    if (onSubmitReview) {
      onSubmitReview(trimmedReview)
    }

    setReviewText('')
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label className="review-form-label" htmlFor="review-text">
        Write a Review
      </label>

      <textarea
        id="review-text"
        className="review-form-textarea"
        rows="5"
        value={reviewText}
        placeholder="Share your thoughts about this movie..."
        onChange={(event) => setReviewText(event.target.value)}
      />

      <button type="submit" className="review-form-button">
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm