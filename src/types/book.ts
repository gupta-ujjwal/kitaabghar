export type ReadingStatus = 'want-to-read' | 'reading' | 'paused' | 'read'

export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  genre?: string
  status: ReadingStatus
  rating?: number
  pages?: number
  notes?: string
  dateAdded: string
  dateStarted?: string
  dateFinished?: string
}

export interface StatusActions {
  onStart: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onFinish: (id: string) => void
}

export const READING_STATUSES: { value: ReadingStatus; label: string }[] = [
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'paused', label: 'Paused' },
  { value: 'read', label: 'Read' },
]
