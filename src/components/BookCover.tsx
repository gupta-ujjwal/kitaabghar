import { useState } from 'react'

interface BookCoverProps {
  id: string
  title: string
  coverUrl?: string
  titleClassName?: string
}

const GRADIENTS = [
  'linear-gradient(135deg, #f97316, #db2777)',
  'linear-gradient(135deg, #6366f1, #06b6d4)',
  'linear-gradient(135deg, #059669, #3b82f6)',
  'linear-gradient(135deg, #e11d48, #f59e0b)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #0ea5e9, #22c55e)',
  'linear-gradient(135deg, #ca8a04, #ef4444)',
  'linear-gradient(135deg, #14b8a6, #6366f1)',
]

/** Hashes the book id so a placeholder's gradient stays put across re-renders/reorders. */
function gradientFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export function BookCover({ id, title, coverUrl, titleClassName = 'text-xs' }: BookCoverProps) {
  const [failed, setFailed] = useState(false)

  if (coverUrl && !failed) {
    return (
      <img
        src={coverUrl}
        alt={`Cover of ${title}`}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center p-2 text-center font-semibold text-white"
      style={{ backgroundImage: gradientFor(id || title) }}
    >
      <span className={`line-clamp-4 ${titleClassName}`}>{title}</span>
    </div>
  )
}
