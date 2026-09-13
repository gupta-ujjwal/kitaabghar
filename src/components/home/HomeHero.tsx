import type { Book, StatusActions } from '../../types/book'
import type { Profile } from '../../types/profile'
import { BookCover } from '../BookCover'
import { BookQuickActions } from '../BookQuickActions'
import { TiltCard } from '../ui/TiltCard'
import { GoalRing } from './GoalRing'
import { StreakFlame } from './StreakFlame'

interface HomeHeroProps {
  profile: Profile
  books: Book[]
  streakCurrent: number
  goalCompleted: number
  goalTarget: number
  onChangeGoalTarget: (target: number) => void
  onOpenBook: (book: Book) => void
  actions: StatusActions
}

function shelfStatusLabel(book: Book): string {
  if (book.status === 'read') return book.rating ? '★'.repeat(book.rating) : 'Finished'
  if (book.status === 'paused') return 'Paused'
  if (book.status === 'reading') return 'Reading'
  return 'Up next'
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function HomeHero({
  profile,
  books,
  streakCurrent,
  goalCompleted,
  goalTarget,
  onChangeGoalTarget,
  onOpenBook,
  actions,
}: HomeHeroProps) {
  const reading = books.filter((b) => b.status === 'reading')
  const wantToRead = books.filter((b) => b.status === 'want-to-read')
  const paused = books.filter((b) => b.status === 'paused')
  const hero = reading[0]
  const shelf = [...reading.slice(1), ...paused, ...wantToRead, ...books.filter((b) => b.status === 'read')]
    .filter((b) => b.id !== hero?.id)
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      {profile.name ? <p className="text-sm text-[var(--color-ink-soft)]">Welcome back, {profile.name}.</p> : null}

      {hero ? (
        <TiltCard rotateAmplitude={3} scaleOnHover={1.005}>
          <div className="grid grid-cols-[76px_1fr] gap-4 rounded-3xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-4 shadow-[0_20px_40px_-28px_rgba(20,20,25,0.35)] sm:grid-cols-[112px_1fr] sm:gap-5 sm:p-6">
            <button
              type="button"
              onClick={() => onOpenBook(hero)}
              className="aspect-[2/3] w-full self-start overflow-hidden rounded-2xl bg-[var(--color-accent-soft)] shadow-[0_16px_28px_-14px_rgba(53,86,232,0.4)]"
            >
              <BookCover id={hero.id} title={hero.title} coverUrl={hero.coverUrl} titleClassName="text-sm" eager />
            </button>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                Now Reading
              </p>
              <h1 className="text-lg font-bold leading-tight sm:text-xl">{hero.title}</h1>
              <p className="text-sm text-[var(--color-ink-soft)]">{hero.author}</p>
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                {hero.dateStarted ? `Started ${formatDate(hero.dateStarted)}` : null}
                {hero.dateStarted && hero.pages ? ' · ' : null}
                {hero.pages ? `${hero.pages} pages` : null}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <BookQuickActions
                  status={hero.status}
                  onStart={() => actions.onStart(hero.id)}
                  onPause={() => actions.onPause(hero.id)}
                  onResume={() => actions.onResume(hero.id)}
                  onFinish={() => actions.onFinish(hero.id)}
                />
              </div>
            </div>
          </div>
        </TiltCard>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--color-line)] p-6 text-center text-[var(--color-ink-soft)]">
          {wantToRead.length > 0 || paused.length > 0 ? (
            <>
              <p className="mb-3">Nothing in progress. Pick up something new?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {wantToRead.slice(0, 2).map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => actions.onStart(book.id)}
                    className="rounded-full border border-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
                  >
                    Start "{book.title}"
                  </button>
                ))}
                {paused.slice(0, 2).map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => actions.onResume(book.id)}
                    className="rounded-full border border-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
                  >
                    Resume "{book.title}"
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>Add a book to your library to get started.</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <StreakFlame current={streakCurrent} />
        <GoalRing completed={goalCompleted} target={goalTarget} onChangeTarget={onChangeGoalTarget} />
      </div>

      {shelf.length > 0 ? (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-semibold">Up Next</h2>
            <span className="text-xs text-[var(--color-ink-soft)]">{shelf.length} in your shelf</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {shelf.map((book) => (
              <div key={book.id} className="flex flex-col gap-2">
                <button type="button" onClick={() => onOpenBook(book)} className="text-left">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-line)] shadow-[0_10px_20px_-14px_rgba(20,20,25,0.35)]">
                    <BookCover id={book.id} title={book.title} coverUrl={book.coverUrl} eager />
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold">{book.title}</p>
                  <p className="truncate text-xs text-[var(--color-ink-soft)]">
                    {book.author} · {shelfStatusLabel(book)}
                  </p>
                </button>
                <BookQuickActions
                  status={book.status}
                  onStart={() => actions.onStart(book.id)}
                  onPause={() => actions.onPause(book.id)}
                  onResume={() => actions.onResume(book.id)}
                  onFinish={() => actions.onFinish(book.id)}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
