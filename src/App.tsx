import { useMemo, useState } from 'react'
import { BookFormModal } from './components/BookFormModal'
import { BookGrid } from './components/BookGrid'
import { BookShelfView } from './components/BookShelfView'
import { Confetti } from './components/Confetti'
import { FilterBar } from './components/FilterBar'
import { Header } from './components/Header'
import { EmptyLibrary } from './components/home/EmptyLibrary'
import { HomeHero } from './components/home/HomeHero'
import { ImportModal } from './components/ImportModal'
import { ProfileView } from './components/ProfileView'
import { WrappedView } from './components/WrappedView'
import { useActivityLog } from './hooks/useActivityLog'
import { useBooks } from './hooks/useBooks'
import { useProfile } from './hooks/useProfile'
import { useReadingGoal } from './hooks/useReadingGoal'
import type { Book, ReadingStatus } from './types/book'

type View = 'home' | 'library' | 'wrapped' | 'profile'
type LibraryView = 'cards' | 'shelf'

function App() {
  const { books, addBook, updateBook, deleteBook, importBooks, clearBooks, loaded: booksLoaded } = useBooks()
  const { streak, logActivity, clearActivity, loaded: activityLoaded } = useActivityLog()
  const { goal, setTarget, resetGoal, loaded: goalLoaded } = useReadingGoal()
  const { profile, updateProfile, clearProfile, loaded: profileLoaded } = useProfile()

  const [view, setView] = useState<View>('home')
  const [libraryView, setLibraryView] = useState<LibraryView>('cards')
  const [modalOpen, setModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [celebrating, setCelebrating] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all')
  const [genreFilter, setGenreFilter] = useState('all')

  const currentYear = new Date().getFullYear()
  const goalCompleted = useMemo(
    () =>
      books.filter(
        (b) =>
          b.status === 'read' &&
          b.dateFinished &&
          new Date(b.dateFinished).getFullYear() === currentYear,
      ).length,
    [books, currentYear],
  )

  const genres = useMemo(
    () => Array.from(new Set(books.map((b) => b.genre).filter(Boolean))) as string[],
    [books],
  )

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter
      return matchesSearch && matchesStatus && matchesGenre
    })
  }, [books, search, statusFilter, genreFilter])

  function celebrate() {
    setCelebrating(true)
    window.setTimeout(() => setCelebrating(false), 1400)
  }

  function openAddModal() {
    setEditingBook(null)
    setModalOpen(true)
  }

  function openEditModal(book: Book) {
    setEditingBook(book)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingBook(null)
  }

  function handleSave(formValues: Omit<Book, 'id' | 'dateAdded'>) {
    const today = new Date().toISOString().slice(0, 10)
    const withDates: Omit<Book, 'id' | 'dateAdded'> = {
      ...formValues,
      dateStarted:
        formValues.status !== 'want-to-read' && !formValues.dateStarted
          ? today
          : formValues.dateStarted,
      dateFinished:
        formValues.status === 'read' && !formValues.dateFinished
          ? today
          : formValues.status !== 'read'
            ? undefined
            : formValues.dateFinished,
    }

    const justFinished = formValues.status === 'read' && editingBook?.status !== 'read'

    if (editingBook) {
      updateBook(editingBook.id, withDates)
    } else {
      addBook(withDates)
    }
    logActivity()
    if (justFinished) celebrate()
    closeModal()
  }

  function handleDelete(id: string) {
    deleteBook(id)
    closeModal()
  }

  function handleImport(imported: Book[]) {
    importBooks(imported)
    logActivity()
  }

  function handleStart(bookId: string) {
    const book = books.find((b) => b.id === bookId)
    if (!book) return
    const today = new Date().toISOString().slice(0, 10)
    updateBook(bookId, { status: 'reading', dateStarted: book.dateStarted ?? today })
    logActivity()
  }

  function handlePause(bookId: string) {
    updateBook(bookId, { status: 'paused' })
    logActivity()
  }

  function handleResume(bookId: string) {
    updateBook(bookId, { status: 'reading' })
    logActivity()
  }

  function handleFinish(bookId: string) {
    const book = books.find((b) => b.id === bookId)
    if (!book) return
    const today = new Date().toISOString().slice(0, 10)
    updateBook(bookId, { status: 'read', dateFinished: book.dateFinished ?? today })
    logActivity()
    celebrate()
  }

  const statusActions = { onStart: handleStart, onPause: handlePause, onResume: handleResume, onFinish: handleFinish }

  function handleDeleteAll() {
    clearBooks()
    clearActivity()
    resetGoal()
    clearProfile()
    setView('home')
  }

  if (!booksLoaded || !activityLoaded || !goalLoaded || !profileLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--color-ink-soft)]">Loading your library…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header view={view} onViewChange={setView} onAddBook={openAddModal} onImport={() => setImportModalOpen(true)} />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {view === 'home' && books.length === 0 ? (
          <EmptyLibrary onAddBook={openAddModal} onImport={() => setImportModalOpen(true)} />
        ) : view === 'home' ? (
          <HomeHero
            profile={profile}
            books={books}
            streakCurrent={streak.current}
            goalCompleted={goalCompleted}
            goalTarget={goal.target}
            onChangeGoalTarget={setTarget}
            onOpenBook={openEditModal}
            actions={statusActions}
          />
        ) : view === 'library' ? (
          <>
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              genre={genreFilter}
              onGenreChange={setGenreFilter}
              genres={genres}
            />
            <div className="mb-4 flex justify-end">
              <div className="inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setLibraryView('cards')}
                  className={`rounded-full px-3 py-1 ${libraryView === 'cards' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-ink-soft)]'}`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryView('shelf')}
                  className={`rounded-full px-3 py-1 ${libraryView === 'shelf' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-ink-soft)]'}`}
                >
                  Shelf
                </button>
              </div>
            </div>
            {libraryView === 'cards' ? (
              <BookGrid books={filteredBooks} onSelectBook={openEditModal} actions={statusActions} />
            ) : (
              <BookShelfView books={filteredBooks} onSelectBook={openEditModal} />
            )}
          </>
        ) : view === 'wrapped' ? (
          <WrappedView profile={profile} books={books} streak={streak} />
        ) : (
          <ProfileView
            profile={profile}
            onUpdateProfile={updateProfile}
            books={books}
            streak={streak}
            onDeleteAll={handleDeleteAll}
          />
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-[var(--color-ink-soft)]">
        Built with{' '}
        <a href="https://reactbits.dev" className="underline" target="_blank" rel="noreferrer">
          React Bits
        </a>{' '}
        &{' '}
        <a href="https://skiper-ui.com" className="underline" target="_blank" rel="noreferrer">
          Skiper UI
        </a>
      </footer>

      {modalOpen ? (
        <BookFormModal
          book={editingBook}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      ) : null}

      {importModalOpen ? (
        <ImportModal onImport={handleImport} onClose={() => setImportModalOpen(false)} />
      ) : null}

      {celebrating ? <Confetti /> : null}
    </div>
  )
}

export default App
