interface EmptyLibraryProps {
  onAddBook: () => void
  onImport: () => void
}

export function EmptyLibrary({ onAddBook, onImport }: EmptyLibraryProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-3xl border border-dashed border-[var(--color-line)] px-6 py-20 text-center">
      <span className="text-5xl">📚</span>
      <div className="max-w-sm space-y-1">
        <h1 className="text-xl font-bold">Welcome to Kitaabghar</h1>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Track every book you're reading, want to read, or have finished —
          right here in your browser, with no account needed.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onAddBook}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Add a book
        </button>
        <button
          type="button"
          onClick={onImport}
          className="rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)]"
        >
          Import books
        </button>
      </div>
    </div>
  )
}
