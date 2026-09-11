import { READING_STATUSES, type ReadingStatus } from '../types/book'

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  status: ReadingStatus | 'all'
  onStatusChange: (value: ReadingStatus | 'all') => void
  genre: string
  onGenreChange: (value: string) => void
  genres: string[]
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  genre,
  onGenreChange,
  genres,
}: FilterBarProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by title or author…"
        className="min-w-48 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ReadingStatus | 'all')}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="all">All statuses</option>
        {READING_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={genre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="all">All genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  )
}
