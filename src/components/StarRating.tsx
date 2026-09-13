interface StarRatingProps {
  rating?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}

export function StarRating({ rating = 0, onChange, readOnly }: StarRatingProps) {
  if (readOnly) {
    return (
      <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-lg leading-none"
            style={{ color: star <= rating ? 'var(--color-star)' : 'var(--color-line)' }}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star === rating ? 0 : star)}
          className="cursor-pointer text-lg leading-none"
          style={{ color: star <= rating ? 'var(--color-star)' : 'var(--color-line)' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
