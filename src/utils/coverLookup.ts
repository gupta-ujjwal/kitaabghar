import type { Book } from '../types/book'

/** Looks up a cover via the Open Library search API. Returns null if no cover was found. */
export async function lookupCoverUrl(title: string, author: string): Promise<string | null> {
  const trimmedTitle = title.trim()
  if (!trimmedTitle) return null

  const params = new URLSearchParams({ title: trimmedTitle, limit: '1', fields: 'cover_i' })
  if (author.trim()) params.set('author', author.trim())

  const res = await fetch(`https://openlibrary.org/search.json?${params}`)
  if (!res.ok) throw new Error(`Open Library search failed: ${res.status}`)

  const data = (await res.json()) as { docs?: { cover_i?: number }[] }
  const coverId = data.docs?.[0]?.cover_i
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null
}

const LOOKUP_CONCURRENCY = 4

/**
 * Fills in `coverUrl` for any book missing one, looking books up a few at a time so a
 * large import doesn't fire dozens of requests at once. Books the lookup can't find (or
 * that fail) are left untouched.
 */
export async function fillMissingCovers(
  books: Book[],
  onProgress?: (done: number, total: number) => void,
): Promise<Book[]> {
  const targets = books.filter((b) => !b.coverUrl)
  if (targets.length === 0) return books

  const found = new Map<string, string>()
  let done = 0
  let cursor = 0

  async function worker() {
    while (cursor < targets.length) {
      const book = targets[cursor++]
      try {
        const url = await lookupCoverUrl(book.title, book.author)
        if (url) found.set(book.id, url)
      } catch {
        // Non-fatal — the book just keeps its placeholder cover.
      }
      done += 1
      onProgress?.(done, targets.length)
    }
  }

  await Promise.all(Array.from({ length: Math.min(LOOKUP_CONCURRENCY, targets.length) }, worker))

  return books.map((b) => (found.has(b.id) ? { ...b, coverUrl: found.get(b.id) } : b))
}
