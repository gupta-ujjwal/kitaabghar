interface HeaderProps {
  view: 'library' | 'stats'
  onViewChange: (view: 'library' | 'stats') => void
  onAddBook: () => void
}

export function Header({ view, onViewChange, onAddBook }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-semibold">Virtual Library</h1>
        </div>

        <nav className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => onViewChange('library')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'library'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Library
          </button>
          <button
            type="button"
            onClick={() => onViewChange('stats')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'stats'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Stats
          </button>
        </nav>

        <button
          type="button"
          onClick={onAddBook}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          + Add Book
        </button>
      </div>
    </header>
  )
}
