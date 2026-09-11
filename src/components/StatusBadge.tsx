import type { ReadingStatus } from '../types/book'

const STYLES: Record<ReadingStatus, string> = {
  'want-to-read':
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  reading: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  read: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

const LABELS: Record<ReadingStatus, string> = {
  'want-to-read': 'Want to Read',
  reading: 'Reading',
  read: 'Read',
}

export function StatusBadge({ status }: { status: ReadingStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
