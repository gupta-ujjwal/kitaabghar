export type ReadingStatus = 'want-to-read' | 'reading' | 'read'

export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  genre?: string
  status: ReadingStatus
  rating?: number
  pages?: number
  currentPage?: number
  notes?: string
  dateAdded: string
  dateStarted?: string
  dateFinished?: string
}

export const READING_STATUSES: { value: ReadingStatus; label: string }[] = [
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
]
