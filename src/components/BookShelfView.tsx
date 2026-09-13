import type { Book, ReadingStatus } from '../types/book'
import { BookCover, EAGER_COVER_COUNT } from './BookCover'

const STATUS_DOT: Record<ReadingStatus, string> = {
  'want-to-read': 'var(--color-amber)',
  reading: 'var(--color-accent)',
  paused: 'var(--color-ink-soft)',
  read: 'var(--color-green)',
}

const COVER_WIDTH = 90
const COVER_HEIGHT = 134
const ROW_GAP = 34
const ROW_PITCH = COVER_HEIGHT + ROW_GAP

/** Small deterministic tilt per book so the shelf doesn't look perfectly machined. */
function tiltFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return ((Math.abs(hash) % 9) - 4) * 0.4 // -1.6deg .. 1.6deg
}

interface BookShelfViewProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

export function BookShelfView({ books, onSelectBook }: BookShelfViewProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center text-[var(--color-ink-soft)]">
        <span className="text-4xl">🔍</span>
        <p className="font-medium">No books match your filters</p>
        <p className="text-sm">Try adjusting your search or add a new book.</p>
      </div>
    )
  }

  return (
    <div
      className="grid justify-center gap-x-5 sm:justify-start"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${COVER_WIDTH}px)`,
        gridAutoRows: `${COVER_HEIGHT}px`,
        rowGap: ROW_GAP,
        paddingBottom: ROW_GAP,
        backgroundImage: `repeating-linear-gradient(180deg,
          transparent 0px, transparent ${COVER_HEIGHT}px,
          rgba(20,20,25,0.1) ${COVER_HEIGHT}px, transparent ${COVER_HEIGHT + 9}px,
          var(--color-line) ${COVER_HEIGHT + 9}px, var(--color-line) ${COVER_HEIGHT + 11}px,
          transparent ${COVER_HEIGHT + 11}px, transparent ${ROW_PITCH}px)`,
        backgroundPosition: 'top left',
      }}
    >
      {books.map((book, index) => {
        const tilt = tiltFor(book.id)
        return (
          <button
            key={book.id}
            type="button"
            onClick={() => onSelectBook(book)}
            title={`${book.title} — ${book.author}`}
            className="group relative self-start [transform:rotate(var(--tilt))] transition-transform hover:z-20 hover:[transform:rotate(var(--tilt))_translateY(-6px)]"
            style={{ '--tilt': `${tilt}deg`, transformOrigin: 'bottom center' } as React.CSSProperties}
          >
            <span
              className="absolute right-2 top-1 z-10 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--color-paper-raised)]"
              style={{ backgroundColor: STATUS_DOT[book.status] }}
            />
            <div
              className="relative overflow-hidden rounded-[3px_7px_7px_3px] bg-[var(--color-paper-raised)]"
              style={{
                width: COVER_WIDTH,
                height: COVER_HEIGHT,
                boxShadow:
                  '0 12px 16px -10px rgba(20,20,25,0.45), inset 3px 0 0 rgba(0,0,0,0.18), inset -2px 0 3px rgba(0,0,0,0.12)',
              }}
            >
              <BookCover
                id={book.id}
                title={book.title}
                coverUrl={book.coverUrl}
                titleClassName="text-[9px] leading-tight"
                eager={index < EAGER_COVER_COUNT}
              />

              {/* spine binding shadow */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-2"
                style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0))' }}
              />
              {/* page-edge texture */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-[5px]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(180deg, #f4ecd8 0px, #f4ecd8 2px, #d9cdb0 2px, #d9cdb0 3px)',
                  boxShadow: 'inset 1px 0 1px rgba(0,0,0,0.15)',
                }}
              />
              {/* subtle top gloss */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0))' }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
