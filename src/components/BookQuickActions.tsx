import type { ReadingStatus } from '../types/book'

interface BookQuickActionsProps {
  status: ReadingStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onFinish: () => void
  className?: string
}

const actionClass = 'text-xs font-semibold text-[var(--color-accent)] hover:underline'

export function BookQuickActions({
  status,
  onStart,
  onPause,
  onResume,
  onFinish,
  className = '',
}: BookQuickActionsProps) {
  if (status === 'read') return null

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {status === 'want-to-read' ? (
        <button type="button" onClick={onStart} className={actionClass}>
          Start
        </button>
      ) : null}
      {status === 'paused' ? (
        <button type="button" onClick={onResume} className={actionClass}>
          Resume
        </button>
      ) : null}
      {status === 'reading' ? (
        <button type="button" onClick={onPause} className={actionClass}>
          Pause
        </button>
      ) : null}
      {status === 'reading' || status === 'paused' ? (
        <button type="button" onClick={onFinish} className={actionClass}>
          Finish
        </button>
      ) : null}
    </div>
  )
}
