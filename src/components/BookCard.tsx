import type { Book } from '../types/book'
import { StarRating } from './StarRating'
import { StatusBadge } from './StatusBadge'

interface BookCardProps {
  book: Book
  onClick: () => void
}

export function BookCard({ book, onClick }: BookCardProps) {
  const progress =
    book.status === 'reading' && book.pages && book.currentPage
      ? Math.round((book.currentPage / book.pages) * 100)
      : null

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex aspect-[2/3] items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <span className="px-2 text-center text-sm text-gray-400">
            {book.title}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <StatusBadge status={book.status} />
        <h3 className="line-clamp-2 font-medium text-gray-900 dark:text-white">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {book.author}
        </p>

        {book.status === 'read' && book.rating ? (
          <StarRating rating={book.rating} readOnly />
        ) : null}

        {progress !== null ? (
          <div className="mt-auto pt-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">{progress}% done</p>
          </div>
        ) : null}
      </div>
    </button>
  )
}
