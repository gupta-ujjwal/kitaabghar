import { CircleUserRound, Home, Library, Plus, Sparkles, Upload } from 'lucide-react'

type View = 'home' | 'library' | 'wrapped' | 'profile'

interface HeaderProps {
  view: View
  onViewChange: (view: View) => void
  onAddBook: () => void
  onImport: () => void
}

const TABS: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'wrapped', label: 'Wrapped', icon: Sparkles },
]

export function Header({ view, onViewChange, onAddBook, onImport }: HeaderProps) {
  const profileButton = (
    <button
      type="button"
      onClick={() => onViewChange('profile')}
      aria-label="Profile"
      className={`rounded-full p-2 transition-colors ${
        view === 'profile'
          ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
          : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-raised)] hover:text-[var(--color-ink)]'
      }`}
    >
      <CircleUserRound size={22} />
    </button>
  )

  return (
    <>
      <header className="border-b border-[var(--color-line)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <p className="text-sm font-bold sm:text-base">Kitaabghar</p>

          <nav className="hidden items-center gap-6 sm:flex">
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

          <div className="hidden items-center gap-4 sm:flex">
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
            {profileButton}
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={onImport}
              aria-label="Import"
              className="rounded-full p-2 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-paper-raised)] hover:text-[var(--color-ink)]"
            >
              <Upload size={22} />
            </button>
            <button
              type="button"
              onClick={onAddBook}
              aria-label="Add Book"
              className="rounded-full bg-[var(--color-accent)] p-2 text-white transition-opacity hover:opacity-90"
            >
              <Plus size={22} />
            </button>
            {profileButton}
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-paper-raised)] sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-3 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 text-xs transition-colors ${
                view === tab.id
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-ink-soft)]'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
