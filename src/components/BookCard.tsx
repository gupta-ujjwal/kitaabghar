import type { Book, StatusActions } from '../types/book'
import { BookCover } from './BookCover'
import { BookQuickActions } from './BookQuickActions'
import { StarRating } from './StarRating'
import { StatusBadge } from './StatusBadge'
import { TiltCard } from './ui/TiltCard'

interface BookCardProps {
  book: Book
  onClick: () => void
  actions: StatusActions
}

export function BookCard({ book, onClick, actions }: BookCardProps) {
  return (
    <TiltCard rotateAmplitude={6} scaleOnHover={1.02}>
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] shadow-[0_1px_2px_rgba(20,20,25,0.06)] transition-shadow hover:shadow-[0_16px_28px_-14px_rgba(20,20,25,0.25)]">
        <button type="button" onClick={onClick} className="flex flex-col text-left">
          <div className="flex aspect-[2/3] items-center justify-center overflow-hidden bg-[var(--color-paper)]">
            <BookCover id={book.id} title={book.title} coverUrl={book.coverUrl} titleClassName="text-sm" />
          </div>

          <div className="flex flex-col gap-1.5 p-3 pb-0">
            <StatusBadge status={book.status} />
            <h3 className="line-clamp-2 font-semibold">{book.title}</h3>
            <p className="text-sm text-[var(--color-ink-soft)]">{book.author}</p>

            {book.status === 'read' && book.rating ? (
              <StarRating rating={book.rating} readOnly />
            ) : null}
          </div>
        </button>

        <div className="p-3 pt-2">
          <BookQuickActions
            status={book.status}
            onStart={() => actions.onStart(book.id)}
            onPause={() => actions.onPause(book.id)}
            onResume={() => actions.onResume(book.id)}
            onFinish={() => actions.onFinish(book.id)}
          />
        </div>
      </div>
    </TiltCard>
  )
}
