import { useState } from 'react'
import { AnimatedNumber } from '../ui/AnimatedNumber'

interface GoalRingProps {
  completed: number
  target: number
  onChangeTarget: (target: number) => void
}

const SIZE = 30
const STROKE = 4
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function GoalRing({ completed, target, onChangeTarget }: GoalRingProps) {
  const [editing, setEditing] = useState(false)
  const progress = Math.min(1, target > 0 ? completed / target : 0)
  const year = new Date().getFullYear()

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const value = Number(new FormData(e.currentTarget).get('target'))
          if (value > 0) onChangeTarget(value)
          setEditing(false)
        }}
        className="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] py-2 pl-4 pr-3"
      >
        <span className="text-xs text-[var(--color-ink-soft)]">{year} goal</span>
        <input
          name="target"
          type="number"
          min={1}
          defaultValue={target}
          autoFocus
          className="w-14 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-2 py-0.5 text-center text-sm"
        />
        <button type="submit" className="text-xs font-semibold text-[var(--color-accent)]">
          Save
        </button>
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] py-2 pl-2 pr-4"
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90 shrink-0">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="text-left">
        <span className="font-mono text-sm font-bold leading-none">
          <AnimatedNumber value={completed} /> / {target}
        </span>
        <span className="ml-1 text-xs text-[var(--color-ink-soft)]">{year} goal</span>
      </div>
    </button>
  )
}
