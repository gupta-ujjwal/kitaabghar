import { useEffect, useState } from 'react'
import { useModalDismiss } from '../hooks/useModalDismiss'
import { READING_STATUSES, type Book, type ReadingStatus } from '../types/book'
import { lookupCoverUrl } from '../utils/coverLookup'
import { BookCover } from './BookCover'
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
  notes: '',
}

const fieldClass =
  'rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 focus:border-[var(--color-accent)] focus:outline-none'

type CoverLookupStatus = 'idle' | 'loading' | 'not-found' | 'error'

export function BookFormModal({ book, onSave, onDelete, onClose }: BookFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [coverLookupStatus, setCoverLookupStatus] = useState<CoverLookupStatus>('idle')

  useModalDismiss(onClose)

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
        notes: book.notes ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setConfirmingDelete(false)
    setCoverLookupStatus('idle')
  }, [book])

  async function handleFetchCover() {
    if (!form.title.trim()) return
    setCoverLookupStatus('loading')
    try {
      const url = await lookupCoverUrl(form.title, form.author)
      if (url) {
        setForm((f) => ({ ...f, coverUrl: url }))
        setCoverLookupStatus('idle')
      } else {
        setCoverLookupStatus('not-found')
      }
    } catch {
      setCoverLookupStatus('error')
    }
  }

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
      notes: form.notes.trim() || undefined,
      dateStarted: book?.dateStarted,
      dateFinished: book?.dateFinished,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] shadow-[0_20px_50px_rgba(20,20,25,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
          <p className="text-base font-semibold">{book ? 'Edit Book' : 'Add Book'}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6">
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Author
            <input
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className={fieldClass}
            />
          </label>

          <div className="flex flex-col gap-1 text-sm">
            Cover image
            <div className="flex gap-3">
              <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--color-line)]">
                <BookCover
                  id={book?.id ?? 'preview'}
                  title={form.title || 'Untitled'}
                  coverUrl={form.coverUrl || undefined}
                  titleClassName="text-[9px] leading-tight"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <input
                  value={form.coverUrl}
                  onChange={(e) => {
                    setForm({ ...form, coverUrl: e.target.value })
                    setCoverLookupStatus('idle')
                  }}
                  placeholder="https://… or fetch automatically"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={handleFetchCover}
                  disabled={!form.title.trim() || coverLookupStatus === 'loading'}
                  className="self-start rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {coverLookupStatus === 'loading' ? 'Searching…' : 'Fetch cover automatically'}
                </button>
                {coverLookupStatus === 'not-found' ? (
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    No cover found for that title/author — paste a link instead, or leave it
                    blank for a placeholder.
                  </p>
                ) : null}
                {coverLookupStatus === 'error' ? (
                  <p className="text-xs text-[var(--color-destructive)]">
                    Couldn't reach the cover lookup service. Check your connection and try again.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Genre
              <input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ReadingStatus })
                }
                className={fieldClass}
              >
                {READING_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
              className={fieldClass}
            />
          </label>

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
              className={`resize-none ${fieldClass}`}
            />
          </label>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-4">
            {book ? (
              confirmingDelete ? (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-[var(--color-ink-soft)]">Delete this book?</span>
                  <button
                    type="button"
                    onClick={() => onDelete(book.id)}
                    className="rounded-lg bg-[var(--color-destructive)] px-3 py-1.5 font-medium text-white hover:opacity-90"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-lg px-3 py-1.5 font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-destructive)] hover:bg-[var(--color-destructive-soft)]"
                >
                  Delete
                </button>
              )
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {book ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
