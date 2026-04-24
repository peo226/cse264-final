function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return <p className="review-list-empty">No reviews yet.</p>
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const reviewId = review.id ?? `${review.username}-${review.text}`

        return (
          <div key={reviewId} className="review-item">
            <div className="review-item-header">
              <h4 className="review-item-username">
                {review.username ?? 'Anonymous User'}
              </h4>
              {review.rating ? (
                <span className="review-item-rating">{review.rating}/5</span>
              ) : null}
            </div>

            <p className="review-item-text">{review.text ?? ''}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ReviewList