import { useEffect, useState } from 'react'
import { READING_STATUSES, type Book, type ReadingStatus } from '../types/book'
import { StarRating } from './StarRating'

interface BookFormModalProps {
  book: Book | null // null = creating a new book
  onSave: (book: Omit<Book, 'id' | 'dateAdded'>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const EMPTY_FORM = {
  title: '',
  author: '',
  coverUrl: '',
  genre: '',
  status: 'want-to-read' as ReadingStatus,
  rating: 0,
  pages: undefined as number | undefined,
  currentPage: undefined as number | undefined,
  notes: '',
}

export function BookFormModal({ book, onSave, onDelete, onClose }: BookFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl ?? '',
        genre: book.genre ?? '',
        status: book.status,
        rating: book.rating ?? 0,
        pages: book.pages,
        currentPage: book.currentPage,
        notes: book.notes ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setConfirmingDelete(false)
  }, [book])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) return

    onSave({
      title: form.title.trim(),
      author: form.author.trim(),
      coverUrl: form.coverUrl.trim() || undefined,
      genre: form.genre.trim() || undefined,
      status: form.status,
      rating: form.status === 'read' && form.rating > 0 ? form.rating : undefined,
      pages: form.pages,
      currentPage: form.status === 'reading' ? form.currentPage : undefined,
      notes: form.notes.trim() || undefined,
      dateStarted: book?.dateStarted,
      dateFinished: book?.dateFinished,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {book ? 'Edit Book' : 'Add Book'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Author
            <input
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Cover image URL
            <input
              value={form.coverUrl}
              onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
              placeholder="https://…"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Genre
              <input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ReadingStatus })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              >
                {READING_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Total pages
              <input
                type="number"
                min={0}
                value={form.pages ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pages: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </label>

            {form.status === 'reading' ? (
              <label className="flex flex-col gap-1 text-sm">
                Current page
                <input
                  type="number"
                  min={0}
                  max={form.pages}
                  value={form.currentPage ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currentPage: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </label>
            ) : null}
          </div>

          {form.status === 'read' ? (
            <div className="flex flex-col gap-1 text-sm">
              Rating
              <StarRating
                rating={form.rating}
                onChange={(rating) => setForm({ ...form, rating })}
              />
            </div>
          ) : null}

          <label className="flex flex-col gap-1 text-sm">
            Notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </label>

          <div className="mt-2 flex items-center justify-between gap-3">
            {book ? (
              confirmingDelete ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Delete this book?</span>
                  <button
                    type="button"
                    onClick={() => onDelete(book.id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-500"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-lg px-3 py-1.5 font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Delete
                </button>
              )
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              {book ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
