import type { Book } from '../types/book'
import { computeAchievements } from '../utils/achievements'
import type { StreakInfo } from '../utils/streak'
import { AchievementsShelf } from './AchievementsShelf'
import { AnimatedNumber } from './ui/AnimatedNumber'
import SplitText from './ui/SplitText'

interface WrappedViewProps {
  books: Book[]
  streak: StreakInfo
}

function daysBetween(a: string, b: string) {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000))
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
      <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
      <p className="mt-1 font-mono text-4xl font-semibold text-[var(--color-accent)]">
        <AnimatedNumber value={value} />
      </p>
    </div>
  )
}

function HighlightCard({
  label,
  book,
  detail,
}: {
  label: string
  book: Book | undefined
  detail: string
}) {
  if (!book) return null
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-4">
      <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-[var(--color-paper)]">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">{label}</p>
        <p className="font-medium leading-tight">{book.title}</p>
        <p className="text-sm text-[var(--color-ink-soft)]">{detail}</p>
      </div>
    </div>
  )
}

export function WrappedView({ books, streak }: WrappedViewProps) {
  const currentYear = new Date().getFullYear()
  const readBooks = books.filter((b) => b.status === 'read')
  const readThisYear = readBooks.filter(
    (b) => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear,
  )
  const pagesRead = readBooks.reduce((sum, b) => sum + (b.pages ?? 0), 0)

  const longestBook = [...readBooks].sort((a, b) => (b.pages ?? 0) - (a.pages ?? 0))[0]
  const topRated = [...readBooks].filter((b) => b.rating).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]
  const fastestRead = [...readBooks]
    .filter((b) => b.dateStarted && b.dateFinished)
    .sort(
      (a, b) =>
        daysBetween(a.dateStarted!, a.dateFinished!) - daysBetween(b.dateStarted!, b.dateFinished!),
    )[0]

  const genreCounts = books.reduce<Record<string, number>>((acc, b) => {
    const genre = b.genre || 'Uncategorized'
    acc[genre] = (acc[genre] ?? 0) + 1
    return acc
  }, {})
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
  const maxCount = sortedGenres[0]?.[1] ?? 1

  const achievements = computeAchievements(books, streak.longest)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SplitText
          text={`Your ${currentYear} Wrapped`}
          tag="h1"
          className="text-3xl font-bold sm:text-4xl"
          textAlign="left"
          splitType="chars"
          delay={20}
        />
        <p className="mt-2 text-[var(--color-ink-soft)]">A personal recap of your reading life.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Books" value={books.length} />
        <StatTile label={`Read in ${currentYear}`} value={readThisYear.length} />
        <StatTile label="Pages Read" value={pagesRead} />
        <StatTile label="Longest Streak" value={streak.longest} />
      </div>

      {(longestBook || topRated || fastestRead) && (
        <div className="grid gap-3 sm:grid-cols-3">
          <HighlightCard label="Longest Book" book={longestBook} detail={`${longestBook?.pages ?? 0} pages`} />
          <HighlightCard
            label="Top Rated"
            book={topRated}
            detail={`${'★'.repeat(topRated?.rating ?? 0)}`}
          />
          <HighlightCard
            label="Fastest Finish"
            book={fastestRead}
            detail={
              fastestRead
                ? `${daysBetween(fastestRead.dateStarted!, fastestRead.dateFinished!)} days`
                : ''
            }
          />
        </div>
      )}

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
        <h3 className="mb-4 text-lg font-semibold">Books by Genre</h3>
        {sortedGenres.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">
            Add some books to see a breakdown.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sortedGenres.map(([genre, count]) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm">{genre}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-sm text-[var(--color-ink-soft)]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <AchievementsShelf achievements={achievements} />
    </div>
  )
}
