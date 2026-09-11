import { useMemo, useState } from 'react'
import { BookFormModal } from './components/BookFormModal'
import { BookGrid } from './components/BookGrid'
import { FilterBar } from './components/FilterBar'
import { Header } from './components/Header'
import { StatsPanel } from './components/StatsPanel'
import { useBooks } from './hooks/useBooks'
import type { Book, ReadingStatus } from './types/book'

function App() {
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [view, setView] = useState<'library' | 'stats'>('library')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all')
  const [genreFilter, setGenreFilter] = useState('all')

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

    if (editingBook) {
      updateBook(editingBook.id, withDates)
    } else {
      addBook(withDates)
    }
    closeModal()
  }

  function handleDelete(id: string) {
    deleteBook(id)
    closeModal()
  }

  return (
    <div className="min-h-screen">
      <Header view={view} onViewChange={setView} onAddBook={openAddModal} />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {view === 'library' ? (
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
            <BookGrid books={filteredBooks} onSelectBook={openEditModal} />
          </>
        ) : (
          <StatsPanel books={books} />
        )}
      </main>

      {modalOpen ? (
        <BookFormModal
          book={editingBook}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      ) : null}
    </div>
  )
}

export default App
