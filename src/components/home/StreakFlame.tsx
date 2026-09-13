import { AnimatedNumber } from '../ui/AnimatedNumber'

export function StreakFlame({ current }: { current: number }) {
  const isLive = current > 0

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] py-2 pl-2 pr-4">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className={isLive ? 'animate-[flicker_1.8s_ease-in-out_infinite]' : 'opacity-30'}
        style={{ transformOrigin: 'bottom center' }}
      >
        <path
          d="M12 2c1.4 4-2.6 5.4-2.6 9.4a4.6 4.6 0 0 0 9.2 0c0-1.8-.9-2.9-1.9-3.9.1 1.9-1 2.9-1.9 1.9 1-2.8-.9-4.6-2.8-7.4z"
          fill={isLive ? 'var(--color-accent)' : 'var(--color-ink-soft)'}
        />
      </svg>
      <div>
        <span className="font-mono text-sm font-bold leading-none">
          <AnimatedNumber value={current} />
        </span>
        <span className="ml-1 text-xs text-[var(--color-ink-soft)]">
          day{current === 1 ? '' : 's'} streak
        </span>
      </div>
      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50% { transform: scale(1.08) rotate(2deg); }
        }
      `}</style>
    </div>
  )
}
