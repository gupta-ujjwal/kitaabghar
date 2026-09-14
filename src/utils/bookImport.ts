import type { Book, ReadingStatus } from '../types/book'
import { generateId } from './id'
import { normalizeGenre } from './genre'

const VALID_STATUSES: ReadingStatus[] = ['want-to-read', 'reading', 'paused', 'read']

export interface ImportResult {
  books: Book[]
  errors: string[]
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function parseImportFile(raw: unknown): ImportResult {
  if (!Array.isArray(raw)) {
    return { books: [], errors: ['Expected a JSON array of books at the top level.'] }
  }

  const books: Book[] = []
  const errors: string[] = []
  const today = new Date().toISOString().slice(0, 10)

  raw.forEach((item, index) => {
    const row = index + 1
    if (typeof item !== 'object' || item === null) {
      errors.push(`Row ${row}: not an object.`)
      return
    }
    const candidate = item as Record<string, unknown>

    if (!isNonEmptyString(candidate.title)) {
      errors.push(`Row ${row}: missing "title".`)
      return
    }
    if (!isNonEmptyString(candidate.author)) {
      errors.push(`Row ${row}: missing "author".`)
      return
    }

    let status: ReadingStatus = 'want-to-read'
    if (candidate.status !== undefined) {
      if (!VALID_STATUSES.includes(candidate.status as ReadingStatus)) {
        errors.push(`Row ${row}: invalid "status" (must be one of ${VALID_STATUSES.join(', ')}).`)
        return
      }
      status = candidate.status as ReadingStatus
    }

    let rating: number | undefined
    if (candidate.rating !== undefined && candidate.rating !== null) {
      const n = Number(candidate.rating)
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        errors.push(`Row ${row}: "rating" must be an integer from 1 to 5.`)
        return
      }
      rating = n
    }

    let pages: number | undefined
    if (candidate.pages !== undefined && candidate.pages !== null) {
      const n = Number(candidate.pages)
      if (!Number.isInteger(n) || n <= 0) {
        errors.push(`Row ${row}: "pages" must be a positive integer.`)
        return
      }
      pages = n
    }

    const genre = isNonEmptyString(candidate.genre) ? normalizeGenre(candidate.genre) : ''

    books.push({
      id: generateId(),
      title: candidate.title.trim(),
      author: candidate.author.trim(),
      coverUrl: isNonEmptyString(candidate.coverUrl) ? candidate.coverUrl : undefined,
      genre: genre || undefined,
      status,
      rating,
      pages,
      notes: isNonEmptyString(candidate.notes) ? candidate.notes : undefined,
      dateAdded: today,
      dateStarted: isNonEmptyString(candidate.dateStarted) ? candidate.dateStarted : undefined,
      dateFinished: isNonEmptyString(candidate.dateFinished) ? candidate.dateFinished : undefined,
    })
  })

  return { books, errors }
}
