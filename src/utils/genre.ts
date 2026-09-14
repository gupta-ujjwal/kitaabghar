/** Trims and collapses internal whitespace so trivial formatting differences don't fragment the genre list. */
export function normalizeGenre(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

/**
 * Case-insensitively deduplicates genre strings, keeping the first-seen casing as the
 * canonical display form for each distinct genre. Whitespace variants are normalized
 * first so legacy untrimmed values collapse into the same entry.
 */
export function dedupeGenres(genres: string[]): string[] {
  const seen = new Map<string, string>()
  for (const g of genres) {
    const normalized = normalizeGenre(g)
    const key = normalized.toLowerCase()
    if (!seen.has(key)) seen.set(key, normalized)
  }
  return Array.from(seen.values())
}
