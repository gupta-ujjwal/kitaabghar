import type { ReadingStatus } from '../types/book'

const STYLES: Record<ReadingStatus, string> = {
  'want-to-read': 'bg-[var(--color-amber-soft)] text-[var(--color-amber)]',
  reading: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
  paused: 'bg-[var(--color-line)] text-[var(--color-ink-soft)]',
  read: 'bg-[var(--color-green-soft)] text-[var(--color-green)]',
}

const LABELS: Record<ReadingStatus, string> = {
  'want-to-read': 'Want to Read',
  reading: 'Reading',
  paused: 'Paused',
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
