type View = 'home' | 'library' | 'wrapped' | 'profile'

interface HeaderProps {
  view: View
  onViewChange: (view: View) => void
  onAddBook: () => void
  onImport: () => void
}

const TABS: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'wrapped', label: 'Wrapped' },
  { id: 'profile', label: 'Profile' },
]

export function Header({ view, onViewChange, onAddBook, onImport }: HeaderProps) {
  return (
    <header className="border-b border-[var(--color-line)]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <p className="text-sm font-bold sm:text-base">Kitaabghar</p>

        <nav className="flex items-center gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onViewChange(tab.id)}
              className={`text-sm transition-colors ${
                view === tab.id
                  ? 'font-semibold text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onImport}
            className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            Import
          </button>
          <button
            type="button"
            onClick={onAddBook}
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add Book
          </button>
        </div>
      </div>
    </header>
  )
}
