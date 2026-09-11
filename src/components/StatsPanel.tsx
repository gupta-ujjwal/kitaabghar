import type { Book } from '../types/book'

interface StatsPanelProps {
  books: Book[]
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  )
}

export function StatsPanel({ books }: StatsPanelProps) {
  const currentYear = new Date().getFullYear()
  const readBooks = books.filter((b) => b.status === 'read')
  const readThisYear = readBooks.filter(
    (b) => b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear,
  )
  const pagesRead = readBooks.reduce((sum, b) => sum + (b.pages ?? 0), 0)
  const currentlyReading = books.filter((b) => b.status === 'reading').length

  const genreCounts = books.reduce<Record<string, number>>((acc, b) => {
    const genre = b.genre || 'Uncategorized'
    acc[genre] = (acc[genre] ?? 0) + 1
    return acc
  }, {})
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
  const maxCount = sortedGenres[0]?.[1] ?? 1

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Books" value={books.length} />
        <StatTile label={`Read in ${currentYear}`} value={readThisYear.length} />
        <StatTile label="Pages Read" value={pagesRead.toLocaleString()} />
        <StatTile label="Currently Reading" value={currentlyReading} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 font-medium">Books by Genre</h3>
        {sortedGenres.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add some books to see a breakdown.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedGenres.map(([genre, count]) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-sm">{genre}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
